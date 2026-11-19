import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, ChevronRight, CircleCheck, Clock3, FileText, Plus, Sparkles, Users } from 'lucide-react';
import { getDashboardStats } from '../api/dashboard';
import { getJobs } from '../api/jobs';
import { getInterviews } from '../api/interviews';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import CandidateDashboard from '../components/dashboard/CandidateDashboard';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const asList = (data) => data?.results || data || [];
const count = (stats, keys, fallback) => keys.map((key) => key.split('.').reduce((v, part) => v?.[part], stats)).find((v) => v !== undefined && v !== null) ?? fallback;

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ stats: null, jobs: [], interviews: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.allSettled([getDashboardStats(), getJobs(), getInterviews()]).then(([stats, jobs, interviews]) => {
      setData({ stats: stats.status === 'fulfilled' ? stats.value.data : null, jobs: jobs.status === 'fulfilled' ? asList(jobs.value.data) : [], interviews: interviews.status === 'fulfilled' ? asList(interviews.value.data) : [] });
      if ([stats, jobs, interviews].every((item) => item.status === 'rejected')) toast.error('Could not connect to the hiring workspace');
      setLoading(false);
    });
  }, []);
  if (loading) return <Loader />;
  const { stats, jobs, interviews } = data;
  const role = user?.role || 'RECRUITER';
  if (role === 'ADMIN') return <AdminDashboard/>;
  if (role === 'CANDIDATE') return <CandidateDashboard/>;
  const firstName = user?.first_name || 'there';
  const metrics = [
    { label: 'Open roles', value: count(stats, ['active_jobs', 'jobs.active', 'total_jobs'], jobs.filter((job) => ['PUBLISHED', 'OPEN', 'ACTIVE'].includes(job.status)).length), icon: BriefcaseBusiness, detail: 'Across your hiring team' },
    { label: 'Applications', value: count(stats, ['total_applications', 'applications.total', 'new_applications'], '—'), icon: FileText, detail: 'Across your open roles' },
    { label: 'Applicants', value: count(stats, ['total_candidates', 'candidates.total'], '—'), icon: Users, detail: 'Candidates in your pipeline' },
    { label: 'Interviews', value: count(stats, ['total_interviews', 'interviews.total'], interviews.length), icon: CalendarDays, detail: 'Scheduled conversations' },
  ];
  const nextInterviews = interviews.slice(0, 4);
  const recentJobs = jobs.slice(0, 5);

  return <div className="space-y-7">
    <section className="relative overflow-hidden rounded-[26px] bg-[#163d34] px-6 py-7 text-white sm:px-9 sm:py-9">
      <div className="absolute -right-10 -top-28 h-72 w-72 rounded-full border border-white/10"/><div className="absolute -right-1 -top-16 h-52 w-52 rounded-full border border-white/10"/>
      <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
        <div className="max-w-xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d5f5a4]"><Sparkles className="h-3.5 w-3.5"/> Your hiring workspace</div><h1 className="text-3xl font-extrabold tracking-tight sm:text-[38px]">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}.</h1><p className="mt-2 text-sm leading-6 text-white/65">A clear view of your hiring pipeline, team activity, and the next conversations on your calendar.</p></div>
        {role !== 'CANDIDATE' && <Link to="/jobs" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d5f5a4] px-4 py-3 text-sm font-bold text-[#173d34] transition hover:bg-white"><Plus className="h-4 w-4"/> Create a job</Link>}
      </div>
    </section>

    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon, detail }) => <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-[32px] font-extrabold leading-none tracking-tight text-slate-900">{value}</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf7e2] text-[#47713a]"><Icon className="h-5 w-5"/></span></div><p className="mt-4 text-xs text-slate-400">{detail}</p></article>)}</section>

    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="text-base font-bold text-slate-900">Your open roles</h2><p className="mt-1 text-xs text-slate-500">Keep track of active opportunities</p></div><Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-600">All roles <ArrowUpRight className="h-4 w-4"/></Link></div>
        {recentJobs.length ? <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left"><thead><tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Applicants</th><th className="px-6 py-3 text-right">Updated</th></tr></thead><tbody className="divide-y divide-slate-100">{recentJobs.map((job) => <tr key={job.id} className="transition hover:bg-slate-50"><td className="px-6 py-4"><p className="text-sm font-semibold text-slate-800">{job.title}</p><p className="mt-1 text-xs text-slate-400">{job.department_detail?.name || job.department?.name || job.location || 'Hiring team'}</p></td><td className="px-4 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">{(job.status || 'OPEN').replaceAll('_',' ')}</span></td><td className="px-4 py-4 text-sm font-semibold text-slate-700">{job.application_count ?? job.applications_count ?? '—'}</td><td className="px-6 py-4 text-right text-xs text-slate-400">{job.updated_at ? new Date(job.updated_at).toLocaleDateString() : '—'}</td></tr>)}</tbody></table></div> : <div className="px-6 py-12 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 text-sm font-semibold text-slate-700">No roles to show yet</p><p className="mt-1 text-xs text-slate-400">Create your first role to start building a pipeline.</p><Link to="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-800">Explore jobs <ChevronRight className="h-4 w-4"/></Link></div>}</div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-base font-bold text-slate-900">Coming up</h2><p className="mt-1 text-xs text-slate-500">Your interview schedule</p></div><Link to="/interviews" className="text-xs font-bold text-emerald-800">View calendar</Link></div>
        {nextInterviews.length ? <div className="mt-5 space-y-3">{nextInterviews.map((interview) => { const date = interview.scheduled_at || interview.interview_date || interview.date; return <div key={interview.id} className="flex gap-3 rounded-xl border border-slate-100 p-3.5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf7e2] text-[#47713a]"><CalendarDays className="h-4 w-4"/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{interview.application_detail?.job_detail?.title || interview.title || 'Candidate interview'}</p><p className="mt-1 truncate text-xs text-slate-500">{interview.application_detail?.candidate_detail?.first_name || interview.candidate_name || 'Interview scheduled'}</p><p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-400"><Clock3 className="h-3 w-3"/>{date ? new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Time to be confirmed'}</p></div><CircleCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-600"/></div>})}</div> : <div className="py-12 text-center"><CalendarDays className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 text-sm font-semibold text-slate-700">Your calendar is clear</p><p className="mt-1 text-xs text-slate-400">Scheduled interviews will appear here.</p></div>}</div>
    </section>
  </div>;
}
