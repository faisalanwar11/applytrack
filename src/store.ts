export const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn', 'Archived'] as const;
export type Status = typeof STATUSES[number];
export type WorkMode = 'Unknown' | 'Remote' | 'Hybrid' | 'On-site';
export type Activity = {
  id: string;
  type: 'created' | 'status' | 'note';
  at: string;
  from?: Status;
  to?: Status;
  description: string;
};
export type Job = {
  id: string; title: string; company: string; url: string; location: string;
  status: Status; notes: string; createdAt: string; updatedAt: string;
  appliedAt?: string; followUp?: string;
  workMode?: WorkMode; employmentType?: string; salary?: string;
  recruiterName?: string; recruiterEmail?: string; resumeVersion?: string;
  activity?: Activity[];
};
const KEY = 'applytrack_jobs_v1';
const SCHEMA = 2;

/** Keep old v0.1 records readable without rewriting or deleting them. */
export function hydrateJob(raw: Job): Job {
  return {
    ...raw, url: typeof raw.url === 'string' ? raw.url : '', notes: typeof raw.notes === 'string' ? raw.notes : '', location: typeof raw.location === 'string' ? raw.location : '',
    workMode: raw.workMode || 'Unknown',
    activity: Array.isArray(raw.activity) ? raw.activity : [],
  };
}
export async function listJobs(): Promise<Job[]> {
  const result = await chrome.storage.local.get(KEY);
  const records: unknown = result[KEY];
  return Array.isArray(records) ? (records as Job[]).filter(j => j && typeof j.id === 'string').map(hydrateJob) : [];
}
export function normalizeUrl(url: unknown): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  try {
    const u = new URL(url);
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) {
      if (/^utm_/i.test(key) || ['src', 'sid', 'ref', 'refid', 'trackingId', 'trk', 'utm', 'fbclid', 'gclid'].includes(key)) u.searchParams.delete(key);
    }
    u.hostname = u.hostname.toLowerCase();
    u.pathname = u.pathname.replace(/\/$/, '') || '/';
    u.searchParams.sort();
    return u.toString();
  } catch { return url.trim(); }
}
export function createJob(input: Pick<Job, 'title' | 'company' | 'url' | 'location' | 'status'>): Job {
  const now = new Date().toISOString();
  return {
    ...input, id: crypto.randomUUID(), notes: '', workMode: 'Unknown',
    createdAt: now, updatedAt: now,
    appliedAt: input.status === 'Applied' ? now : undefined,
    activity: [{ id: crypto.randomUUID(), type: 'created', at: now, description: 'Added application as ' + input.status }],
  };
}
export function changeStatus(job: Job, status: Status): Job {
  if (job.status === status) return job;
  const now = new Date().toISOString();
  const activity: Activity = {
    id: crypto.randomUUID(), type: 'status', at: now,
    from: job.status, to: status, description: job.status + ' → ' + status,
  };
  return {
    ...job, status, updatedAt: now,
    appliedAt: status === 'Applied' ? (job.appliedAt || now) : job.appliedAt,
    activity: [...(job.activity || []), activity],
  };
}
export async function saveJob(job: Job): Promise<void> {
  const jobs = await listJobs();
  const i = jobs.findIndex(j => j.id === job.id);
  if (i >= 0) jobs[i] = hydrateJob(job); else jobs.unshift(hydrateJob(job));
  await chrome.storage.local.set({ [KEY]: jobs, applytrack_schema: SCHEMA });
}
export async function removeJob(id: string): Promise<void> {
  await chrome.storage.local.set({ [KEY]: (await listJobs()).filter(j => j.id !== id) });
}
export function dueToday(job: Job): boolean {
  if (!job.followUp || ['Rejected', 'Withdrawn', 'Offer', 'Archived'].includes(job.status)) return false;
  const localToday = new Date().toLocaleDateString('en-CA'); // local calendar date
  return job.followUp <= localToday;
}
