import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Plus, Search } from 'lucide-react';
import { getJobs, createJob, getDepartments } from '../api/jobs';
import JobList from '../components/jobs/JobList';
import JobForm from '../components/jobs/JobForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'RECRUITER';

  useEffect(() => { setSearchInput(search); setPage(1); }, [search]);
  useEffect(() => { loadData(); }, [search, status, page]);
  useEffect(() => { getDepartments().then(({ data }) => setDepartments(data?.results || data || [])).catch(() => setDepartments([])); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const query = { page, page_size: 20 };
      if (search.trim()) query.search = search.trim();
      if (status !== 'ALL') query.status = status;
      const { data } = await getJobs(query);
      setJobs(data?.results || data || []);
      setTotal(data?.count ?? data?.length ?? 0);
      setHasNext(Boolean(data?.next)); setHasPrevious(Boolean(data?.previous));
    } catch { toast.error('Could not load job postings. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createJob(data);
      toast.success('Job posted successfully!');
      setShowForm(false);
      loadData();
    } catch (err) { toast.error(err.response?.data?.detail || err.response?.data?.deadline?.[0] || err.response?.data?.salary_max?.[0] || 'Could not save this job.'); }
    setSubmitting(false);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Talent opportunities</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{isStaff ? 'Job openings' : 'Find your next role'}</h1><p className="mt-2 text-sm text-slate-500">{isStaff ? 'Create roles and follow active hiring opportunities.' : 'Explore open positions and see how your skills align.'}</p></div>{isStaff && <Button onClick={() => setShowForm(true)} className="rounded-xl bg-[#176b50] font-bold"><Plus className="h-4 w-4"/>Create a role</Button>}</header>
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center"><form onSubmit={(event) => { event.preventDefault(); setSearchParams(searchInput.trim() ? { search: searchInput.trim() } : {}); setPage(1); }} className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input aria-label="Search job openings" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search roles, teams or locations" className="input-field h-11 pl-9"/><button className="sr-only" type="submit">Search jobs</button></form>{isStaff && <select aria-label="Filter jobs by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="input-field h-11 w-full sm:w-44"><option value="ALL">All statuses</option><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option><option value="ON_HOLD">On hold</option><option value="CLOSED">Closed</option></select>}<span className="shrink-0 text-xs font-medium text-slate-500">{total} {total === 1 ? 'role' : 'roles'}</span></section>
        {loading ? <Loader/> : jobs.length ? <JobList jobs={jobs} onSelect={(job) => navigate(`/jobs/${job.id}`)} /> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 text-sm font-semibold text-slate-700">{search || status !== 'ALL' ? 'No roles match these filters' : 'No open roles yet'}</p><p className="mt-1 text-xs text-slate-400">{search || status !== 'ALL' ? 'Try a different search or status.' : 'Published opportunities will appear here.'}</p></div>}
        {total > 20 && <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"><span className="text-xs text-slate-500">Page {page} · {total} results</span><div className="flex gap-2"><button disabled={!hasPrevious} onClick={() => setPage((value) => value - 1)} className="btn-secondary h-9 px-3 text-xs disabled:opacity-40"><ArrowLeft className="h-3.5 w-3.5"/>Previous</button><button disabled={!hasNext} onClick={() => setPage((value) => value + 1)} className="btn-secondary h-9 px-3 text-xs disabled:opacity-40">Next<ArrowRight className="h-3.5 w-3.5"/></button></div></div>}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Post New Job" size="lg">
        <JobForm onSubmit={handleCreate} departments={departments} loading={submitting} />
      </Modal>
    </div>
  );
}
