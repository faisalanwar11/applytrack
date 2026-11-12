import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Job,Status,changeStatus,createJob,listJobs,normalizeUrl,saveJob} from './store';
import './styles.css';
/** JobPosting fields sometimes contain arrays instead of strings (e.g. addressLocality). */
function asText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(', ');
  return '';
}
function Popup(){
  const[title,setTitle]=useState(''),[company,setCompany]=useState(''),[location,setLocation]=useState('');
  const[url,setUrl]=useState(''),[status,setStatus]=useState<Status>('Saved');
  const[notice,setNotice]=useState(''),[existing,setExisting]=useState<Job|null>(null),[busy,setBusy]=useState(false);
  useEffect(()=>{
    chrome.tabs.query({active:true,currentWindow:true},async tabs=>{
      const tab=tabs[0];if(!tab)return;
      const link=tab.url||'';setUrl(link);setTitle(tab.title?.split(/ [|–-] /)[0]||'');
      const jobs=await listJobs();
      const match=jobs.find(j=>link&&normalizeUrl(j.url)===normalizeUrl(link))||null;
      setExisting(match);if(match){setTitle(match.title);setCompany(match.company);setLocation(match.location);setStatus(match.status);return;}
      if(!tab.id||!/^https?:/.test(link))return;
      try{
        const results=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>{
          let data:any=null;
          for(const el of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))){
            try{
              const json=JSON.parse(el.textContent||'null');
              const arr=Array.isArray(json)?json:[json];
              const nodes=arr.flatMap((node:any)=>node?.['@graph']||[node]);
              const match=nodes.find((node:any)=>node?.['@type']==='JobPosting'||(Array.isArray(node?.['@type'])&&node['@type'].includes('JobPosting')));
              if(match){data=match;break;}
            }catch{}
          }
          const loc=data?.jobLocation;
          const address=(Array.isArray(loc)?loc[0]:loc)?.address;
          return {title:data?.title||'',company:data?.hiringOrganization?.name||'',location:address?.addressLocality||''};
        }});
        const d=results[0]?.result;if(d?.title)setTitle(asText(d.title));if(d?.company)setCompany(asText(d.company));if(d?.location)setLocation(asText(d.location));
      }catch{setNotice('Automatic extraction unavailable. Enter details manually.');}
    });
  },[]);
  async function save(){
    if(!asText(title)||!asText(company)||busy)return;
    setBusy(true);setNotice('');
    try{
      const fields={title:asText(title),company:asText(company),location:asText(location),url:asText(url),status};
      let job:Job;
      if(existing){
        job=changeStatus({...existing,...fields,status:existing.status},status);
        job.updatedAt=new Date().toISOString();
      }else job=createJob(fields);
      await saveJob(job);setExisting(job);setNotice('Application saved on this device.');
    }catch(error){const reason=error instanceof Error?error.message:String(error);console.error('ApplyTrack save failed:',error);setNotice('Save failed: '+reason);}finally{setBusy(false);}
  }
  return <div className="popup stack">
    <div className="row"><div className="brand"><span className="logo">▣</span>ApplyTrack</div><span className="pill">v0.2</span></div>
    <p className="muted">Capture your next opportunity</p>
    {existing&&<p className="pill">Already tracked — updating existing record</p>}
    <div><label>Job title</label><input value={title} onChange={e=>setTitle(e.target.value)}/>
    <label>Company</label><input value={company} onChange={e=>setCompany(e.target.value)}/>
    <label>Location</label><input value={location} onChange={e=>setLocation(e.target.value)}/>
    <label>Status</label><select value={status} onChange={e=>setStatus(e.target.value as Status)}><option>Saved</option><option>Applied</option></select></div>
    <button disabled={!asText(title)||!asText(company)||busy} onClick={()=>void save()}>{busy?'Saving...':existing?'Update Job':'Save Job'}</button>
    {notice&&<p role="status" className="muted">{notice}</p>}
    <button className="secondary" onClick={()=>chrome.tabs.create({url:chrome.runtime.getURL('dashboard.html')})}>Open Dashboard ↗</button>
  </div>;
}
createRoot(document.getElementById('root')!).render(<Popup/>);
