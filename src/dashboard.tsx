import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Job, Status, STATUSES, WorkMode, changeStatus, dueToday, listJobs, removeJob, saveJob } from './store';
import './styles.css';

const fmt = (value?: string) => value ? new Date(value).toLocaleDateString() : '—';
type Editor = {title:string;company:string;location:string;url:string;notes:string;followUp:string;appliedAt:string;workMode:WorkMode;employmentType:string;salary:string;recruiterName:string;recruiterEmail:string;resumeVersion:string};
const draft = (job: Job): Editor => ({
  title:job.title,company:job.company,location:job.location,url:job.url,notes:job.notes||'',followUp:job.followUp||'',
  appliedAt:job.appliedAt?.slice(0,10)||'',workMode:job.workMode||'Unknown',employmentType:job.employmentType||'',
  salary:job.salary||'',recruiterName:job.recruiterName||'',recruiterEmail:job.recruiterEmail||'',resumeVersion:job.resumeVersion||''
});
function download(filename:string, content:string, type:string) {
  const href=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement('a');a.href=href;a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(href),1000);
}
function csvCell(value:unknown){return '"'+String(value??'').replace(/"/g,'""')+'"';}
function Dashboard() {
  const [jobs,setJobs]=useState<Job[]>([]);
  const [query,setQuery]=useState(''),[filter,setFilter]=useState('All'),[sort,setSort]=useState('Newest');
  const [editing,setEditing]=useState<string|null>(null),[form,setForm]=useState<Editor|null>(null);
  const [message,setMessage]=useState('');
  const refresh=()=>listJobs().then(setJobs);
  useEffect(()=>{void refresh();const handler=()=>void refresh();chrome.storage.onChanged.addListener(handler);return()=>chrome.storage.onChanged.removeListener(handler)},[]);
  const shown=useMemo(()=>jobs.filter(j=>(filter==='All'||(filter==='Due'&&dueToday(j))||j.status===filter)
    && [j.title,j.company,j.location,j.recruiterName||''].join(' ').toLowerCase().includes(query.toLowerCase()))
    .sort((a,b)=>sort==='Oldest'?a.createdAt.localeCompare(b.createdAt):sort==='Company'?a.company.localeCompare(b.company):b.createdAt.localeCompare(a.createdAt)),
    [jobs,filter,sort,query]);
  const due=jobs.filter(dueToday).length;
  async function updateStatus(job:Job,status:Status){await saveJob(changeStatus(job,status));await refresh();}
  async function saveDetails(job:Job){
    if(!form)return;
    if(!form.title.trim()||!form.company.trim()){setMessage('Job title and company are required.');return;}
    const next:Job={...job,...form,title:form.title.trim(),company:form.company.trim(),
      appliedAt:form.appliedAt?(job.appliedAt?.startsWith(form.appliedAt)?job.appliedAt:new Date(form.appliedAt+'T12:00:00').toISOString()):undefined,
      updatedAt:new Date().toISOString()};
    await saveJob(next);await refresh();setEditing(null);setForm(null);setMessage('Application details saved.');
  }
  function beginEdit(job:Job){setEditing(editing===job.id?null:job.id);setForm(draft(job));setMessage('');}
  function exportJson(){download('applytrack-backup.json',JSON.stringify(jobs,null,2),'application/json');}
  function exportCsv(){
    const cols:(keyof Job)[]=['title','company','location','url','status','createdAt','appliedAt','followUp','workMode','employmentType','salary','recruiterName','recruiterEmail','resumeVersion','notes'];
    download('applytrack-applications.csv',[cols.join(','),...jobs.map(j=>cols.map(k=>csvCell(j[k])).join(','))].join('\r\n'),'text/csv;charset=utf-8');
  }
  async function importJson(file?:File){
    if(!file)return;
    try{
      if(file.size>5_000_000)throw new Error('Backup is too large (max 5 MB).');
      const raw:unknown=JSON.parse(await file.text());
      if(!Array.isArray(raw)||raw.length>5000||!raw.every(j=>j&&typeof j==='object'
        &&typeof j.id==='string'&&typeof j.title==='string'&&typeof j.company==='string'
        &&typeof j.createdAt==='string'&&STATUSES.includes(j.status)))throw new Error('Invalid backup data.');
      if(!confirm('Import '+raw.length+' records? Matching IDs will be overwritten. Export your current backup first.'))return;
      for(const job of raw as Job[])await saveJob(job);
      await refresh();setMessage('Import finished. Review your applications.');
    }catch(e){setMessage(e instanceof Error?e.message:'Import failed.');}
  }
  const field=(key:keyof Editor,label:string,kind='text')=><label className="field" key={key}>{label}
    {key==='notes'?<textarea rows={4} value={form?.[key]||''} onChange={e=>setForm(f=>f?{...f,[key]:e.target.value}:f)}/>:
    <input type={kind} value={form?.[key]||''} onChange={e=>setForm(f=>f?{...f,[key]:e.target.value}:f)}/>}
  </label>;
  return <div className="layout">
    <aside className="sidebar stack">
      <div className="brand"><span className="logo">▣</span>ApplyTrack</div>
      <button className="secondary" onClick={()=>setFilter('All')}>All applications</button>
      <button className="secondary" onClick={()=>setFilter('Due')}>Follow-ups due ({due})</button>
      <div className="muted">Stored on this browser profile</div>
      <button className="secondary" onClick={exportJson}>Export JSON backup</button>
      <button className="secondary" onClick={exportCsv}>Export CSV</button>
      <label className="muted">Import JSON backup<input type="file" accept=".json,application/json" onChange={e=>{void importJson(e.target.files?.[0]);e.currentTarget.value=''}}/></label>
    </aside>
    <main className="main">
      <h1>My Applications</h1><p className="muted">Track progress and choose your next action.</p>
      <div className="stats">{[
        ['Total jobs',jobs.length],['Applied',jobs.filter(j=>j.status==='Applied').length],
        ['Interviews',jobs.filter(j=>j.status==='Interview').length],['Follow-ups due',due]
      ].map(([label,value])=><div className="card stat" key={label}><span className="muted">{label}</span><strong>{value}</strong></div>)}</div>
      <div className="filterbar">
        <input aria-label="Search applications" placeholder="Search jobs, companies, locations..." value={query} onChange={e=>setQuery(e.target.value)}/>
        <select aria-label="Filter status" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option value="Due">Due</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
        <select aria-label="Sort applications" value={sort} onChange={e=>setSort(e.target.value)}><option>Newest</option><option>Oldest</option><option>Company</option></select>
      </div>
      {message&&<p role="status" className="notice">{message}</p>}
      <div className="jobs">{shown.length===0&&<div className="card muted">No matching applications. Save a job from its listing page to get started.</div>}
      {shown.map(j=><section className="card" key={j.id}>
        <div className="job">
          <div><h3>{j.title}</h3><div className="muted">{j.company}{j.location&&' · '+j.location}</div>
            <div className="muted">Saved {fmt(j.createdAt)}{j.followUp&&' · Follow-up '+j.followUp}{dueToday(j)&&' · Due now'}</div>
            {j.url&&<a href={j.url} target="_blank" rel="noopener noreferrer">View original job ↗</a>}
          </div>
          <div className="actions">
            <select aria-label={'Status for '+j.title} value={j.status} onChange={e=>void updateStatus(j,e.target.value as Status)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
            <button className="secondary" onClick={()=>beginEdit(j)}>{editing===j.id?'Close':'Details'}</button>
            <button className="danger" onClick={async()=>{if(confirm('Permanently delete this application?')){await removeJob(j.id);await refresh()}}}>Delete</button>
          </div>
        </div>
        {editing===j.id&&form&&<div className="details">
          <h3>Edit application</h3>
          <div className="formgrid">{field('title','Job title')}{field('company','Company')}{field('location','Location')}{field('url','Job URL','url')}
            <label className="field">Work arrangement<select value={form.workMode} onChange={e=>setForm(f=>f?{...f,workMode:e.target.value as WorkMode}:f)}>
              {(['Unknown','Remote','Hybrid','On-site'] as WorkMode[]).map(w=><option key={w}>{w}</option>)}</select></label>
            {field('employmentType','Employment type')}{field('salary','Salary / range')}{field('appliedAt','Applied date','date')}
            {field('recruiterName','Recruiter name')}{field('recruiterEmail','Recruiter email','email')}
            {field('resumeVersion','Resume version')}{field('followUp','Next follow-up','date')}
          </div>{field('notes','Notes')}
          <div className="actions"><button onClick={()=>void saveDetails(j)}>Save changes</button><button className="secondary" onClick={()=>setEditing(null)}>Cancel</button></div>
          <h3>Activity history</h3>
          {j.activity?.length?<ol className="timeline">{[...j.activity].reverse().map(e=><li key={e.id}><span>{e.description}</span><span className="muted">{new Date(e.at).toLocaleString()}</span></li>)}</ol>:
            <p className="muted">No recorded history for this legacy application. Future status changes will appear here.</p>}
        </div>}
      </section>)}</div>
    </main>
  </div>;
}
createRoot(document.getElementById('root')!).render(<Dashboard />);
