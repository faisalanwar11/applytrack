export type Status = 'Saved'|'Applied'|'Interview'|'Offer'|'Rejected'|'Withdrawn';
export type Job = {id:string;title:string;company:string;url:string;location:string;status:Status;notes:string;createdAt:string;updatedAt:string;appliedAt?:string;followUp?:string};
const KEY='applytrack_jobs_v1';
export async function listJobs():Promise<Job[]>{const v=await chrome.storage.local.get(KEY);return (v[KEY] as Job[]|undefined)||[];}
export async function saveJob(job:Job){const jobs=await listJobs();const i=jobs.findIndex(j=>j.id===job.id);if(i>=0)jobs[i]=job;else jobs.unshift(job);await chrome.storage.local.set({[KEY]:jobs});}
export async function removeJob(id:string){await chrome.storage.local.set({[KEY]:(await listJobs()).filter(j=>j.id!==id)});}
export function normalizeUrl(url:string){try{const u=new URL(url);u.hash='';['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k=>u.searchParams.delete(k));return u.toString();}catch{return url;}}
