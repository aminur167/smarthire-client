import { useDeferredValue, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Search, Sparkles, UserRound } from 'lucide-react';
import { getApplicationMatch, getApplications, updateApplicationStatus } from '../api/candidates';
import { getDashboardStats } from '../api/dashboard';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['NEW', 'SCREENING', 'QUALIFIED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFERED', 'HIRED', 'REJECTED'];
const STATUS_LABELS = { NEW: 'New', SCREENING: 'Screening', QUALIFIED: 'Qualified', INTERVIEW_SCHEDULED: 'Interview', INTERVIEWED: 'Interviewed', OFFERED: 'Offer', HIRED: 'Hired', REJECTED: 'Declined' };

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [page, setPage] = useState(1);
  const [pipelineCounts, setPipelineCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const deferredSearch = useDeferredValue(search);
  const [match, setMatch] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'RECRUITER';

  const load = async () => {
    setLoading(true);
    const params = { page, page_size: 20 };
    if (deferredSearch.trim()) params.search = deferredSearch.trim();
    if (filter !== 'ALL') params.status = filter;
    try {
      const [{ data }, stats] = await Promise.all([getApplications(params), getDashboardStats()]);
      setApplications(data?.results || data || []);
      setTotal(data?.count ?? data?.length ?? 0);
      setHasNext(Boolean(data?.next)); setHasPrevious(Boolean(data?.previous));
      setPipelineCounts(stats.data || {});
    }
    catch { toast.error('Could not load applications. Please try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [page, deferredSearch, filter]);

  const changeStatus = async (application, status) => {
    const oldStatus = application.status;
    setApplications((current) => current.map((item) => item.id === application.id ? { ...item, status } : item));
    try { await updateApplicationStatus(application.id, { status }); toast.success(`Moved to ${STATUS_LABELS[status] || status}.`); getDashboardStats().then(({ data }) => setPipelineCounts(data)).catch(() => {}); }
    catch (error) { setApplications((current) => current.map((item) => item.id === application.id ? { ...item, status: oldStatus } : item)); toast.error(error.response?.data?.status?.[0] || 'Could not update this application.'); }
  };

  const showMatch = async (application) => {
    setMatchLoading(true); setMatch({ application, detail: null });
    try { const { data } = await getApplicationMatch(application.id); setMatch({ application, detail: data }); }
    catch (error) { setMatch(null); toast.error(error.response?.data?.detail || 'Could not load this skill breakdown.'); }
    finally { setMatchLoading(false); }
  };

  if (loading) return <Loader/>;
  return <div className="space-y-6">
    <header><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Hiring pipeline</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Applications</h1><p className="mt-2 text-sm text-slate-500">Review candidates, compare role skills and keep each application moving.</p></header>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">All applications</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{pipelineCounts.total_applications ?? total}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">In review</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{(pipelineCounts.new_applications || 0) + (pipelineCounts.screening || 0) + (pipelineCounts.qualified || 0)}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Interviews</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{(pipelineCounts.scheduled || 0) + (pipelineCounts.interviewed || 0)}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Offers & hires</p><p className="mt-2 text-2xl font-extrabold text-slate-900">{(pipelineCounts.offered || 0) + (pipelineCounts.joined || 0)}</p></div></section>
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between sm:px-6"><div><h2 className="text-base font-bold text-slate-900">Candidate pipeline</h2><p className="mt-1 text-xs text-slate-500">Showing {applications.length} of {total} applications · Page {page}</p></div><div className="relative w-full lg:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input aria-label="Search applications" placeholder="Search candidates or roles" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="input-field h-10 pl-9"/></div></div>
      <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 px-5 py-3 sm:px-6"><button onClick={() => { setFilter('ALL'); setPage(1); }} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${filter === 'ALL' ? 'bg-[#163d34] text-white' : 'text-slate-500 hover:bg-slate-100'}`}>All <span className="ml-1 opacity-70">{pipelineCounts.total_applications ?? total}</span></button>{STATUSES.map((status) => <button key={status} onClick={() => { setFilter(status); setPage(1); }} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${filter === status ? 'bg-[#163d34] text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{STATUS_LABELS[status]} <span className="ml-1 opacity-70">{pipelineCounts[{ NEW: 'new_applications', SCREENING: 'screening', QUALIFIED: 'qualified', INTERVIEW_SCHEDULED: 'scheduled', INTERVIEWED: 'interviewed', OFFERED: 'offered', HIRED: 'joined', REJECTED: 'rejected' }[status]] || 0}</span></button>)}</div>
      {applications.length ? <div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left"><thead className="bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3">Candidate</th><th className="px-4 py-3">Position</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Skill coverage</th>{isStaff && <th className="px-6 py-3 text-right">Update stage</th>}</tr></thead><tbody className="divide-y divide-slate-100">{applications.map((app) => <tr key={app.id} className="transition hover:bg-slate-50/60"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf7e2] text-xs font-bold text-[#47713a]"><UserRound className="h-4 w-4"/></span><div><p className="text-sm font-semibold text-slate-800">{app.candidate_detail?.first_name} {app.candidate_detail?.last_name}</p><p className="mt-0.5 text-xs text-slate-400">{app.candidate_detail?.email}</p></div></div></td><td className="px-4 py-4 text-sm font-medium text-slate-700">{app.job_detail?.title || '—'}</td><td className="px-4 py-4 text-xs text-slate-500">{formatDate(app.applied_at)}</td><td className="px-4 py-4"><StatusBadge status={app.status}/></td><td className="px-4 py-4"><button onClick={() => showMatch(app)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-extrabold text-emerald-800 hover:bg-emerald-50"><Sparkles className="h-3.5 w-3.5"/>{app.match_scoring_available === false ? 'Not scored' : `${Number(app.ai_match_score || 0).toFixed(0)}%`} <ArrowUpRight className="h-3 w-3"/></button></td>{isStaff && <td className="px-6 py-4 text-right"><select aria-label={`Update status for ${app.candidate_detail?.first_name || 'candidate'}`} value={app.status} onChange={(event) => changeStatus(app, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50">{STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></td>}</tr>)}</tbody></table></div> : <div className="px-6 py-14 text-center"><UserRound className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 text-sm font-semibold text-slate-700">{total ? 'No applications match these filters' : 'No applications in your pipeline yet'}</p><p className="mt-1 text-xs text-slate-400">{total ? 'Adjust your search or choose another stage.' : 'New candidate applications will show up here.'}</p></div>}
      {total > 20 && <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 sm:px-6"><span className="text-xs text-slate-500">{total} total results</span><div className="flex gap-2"><button disabled={!hasPrevious} onClick={() => setPage((current) => current - 1)} className="btn-secondary h-9 px-3 text-xs disabled:opacity-40"><ArrowLeft className="h-3.5 w-3.5"/>Previous</button><button disabled={!hasNext} onClick={() => setPage((current) => current + 1)} className="btn-secondary h-9 px-3 text-xs disabled:opacity-40">Next<ArrowRight className="h-3.5 w-3.5"/></button></div></div>}
    </section>
    <Modal isOpen={!!match} onClose={() => setMatch(null)} title="Skill match breakdown" size="md">{matchLoading ? <div className="py-10 text-center text-sm text-slate-500">Comparing listed skills…</div> : match?.detail && <div className="space-y-5"><div><p className="text-sm font-semibold text-slate-800">{match.application.candidate_detail?.first_name} {match.application.candidate_detail?.last_name}</p><p className="mt-1 text-xs text-slate-500">{match.application.job_detail?.title}</p></div>{match.detail.scoring_available ? <div className="rounded-2xl bg-[#edf7e2] p-4"><div className="flex items-end justify-between"><div><p className="text-xs font-semibold text-[#47713a]">Required skill coverage</p><p className="mt-1 text-3xl font-extrabold text-[#294d28]">{match.detail.score}%</p></div><p className="text-xs text-slate-600">{match.detail.coverage_pct}% of listed skills match</p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#47713a]" style={{ width: `${match.detail.score}%` }}/></div></div> : <p className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-5 text-slate-600">This role has no required skills listed, so a skills match cannot be calculated.</p>}<div><h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Matched skills</h3><div className="flex flex-wrap gap-2">{match.detail.matched_skills?.length ? match.detail.matched_skills.map((skill) => <span key={skill} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800"><Check className="h-3.5 w-3.5"/>{skill}</span>) : <p className="text-xs text-slate-400">No matching skills are listed yet.</p>}</div></div><div><h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Skills to review</h3><div className="flex flex-wrap gap-2">{match.detail.missing_skills?.length ? match.detail.missing_skills.map((skill) => <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">{skill}</span>) : <p className="text-xs text-slate-400">No role skill gaps are listed.</p>}</div></div><p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">{match.detail.note} This skill comparison supports review; it does not determine candidate suitability.</p></div>}</Modal>
  </div>;
}
