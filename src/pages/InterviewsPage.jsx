import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Plus, Video } from 'lucide-react';
import { getInterviews, createInterview, updateInterview } from '../api/interviews';
import { getApplications } from '../api/candidates';
import InterviewList from '../components/interviews/InterviewList';
import ScheduleInterview from '../components/interviews/ScheduleInterview';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'RECRUITER';

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const requests = [getInterviews({ page_size: 100 })];
      if (isStaff) requests.push(getApplications({ page_size: 100 }));
      const [interviewsResponse, applicationsResponse] = await Promise.all(requests);
      setInterviews(interviewsResponse.data?.results || interviewsResponse.data || []);
      const allApplications = applicationsResponse?.data?.results || applicationsResponse?.data || [];
      setApplications(allApplications.filter((application) => !['HIRED', 'REJECTED'].includes(application.status)));
    } catch { toast.error('Could not load interview data. Please try again.'); }
    finally { setLoading(false); }
  }, [isStaff]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSchedule = async (data) => {
    setSubmitting(true);
    try { await createInterview({ ...data, interviewer: user.id }); toast.success('Interview scheduled. The candidate has been notified.'); setShowForm(false); loadData(); }
    catch (error) { toast.error(error.response?.data?.scheduled_at?.[0] || error.response?.data?.application?.[0] || error.response?.data?.detail || 'Could not schedule this interview.'); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (interview, status) => {
    setInterviews((current) => current.map((item) => item.id === interview.id ? { ...item, status } : item));
    try { await updateInterview(interview.id, { status }); toast.success('Interview status updated.'); }
    catch (error) { setInterviews((current) => current.map((item) => item.id === interview.id ? { ...item, status: interview.status } : item)); toast.error(error.response?.data?.status?.[0] || 'Could not update this interview.'); }
  };

  if (loading) return <Loader/>;
  const scheduled = interviews.filter((item) => ['SCHEDULED', 'RESCHEDULED'].includes(item.status)).length;
  const completed = interviews.filter((item) => item.status === 'COMPLETED').length;
  const needsMeetingLink = interviews.filter((item) => ['SCHEDULED', 'RESCHEDULED'].includes(item.status) && !item.meeting_link).length;

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-800">Hiring conversations</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Interviews</h1><p className="mt-2 text-sm text-slate-500">Keep interview times, candidate details and follow-up status in one place.</p></div>{isStaff && <Button onClick={() => setShowForm(true)} className="rounded-xl bg-[#176b50] font-bold"><Plus className="h-4 w-4"/>Schedule an interview</Button>}</header>
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><p className="flex items-center justify-between text-sm text-slate-500">Upcoming<span className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf7e2] text-[#47713a]"><CalendarDays className="h-4 w-4"/></span></p><p className="mt-3 text-3xl font-extrabold text-slate-900">{scheduled}</p><p className="mt-2 text-xs text-slate-400">Scheduled or being rescheduled</p></div><div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><p className="flex items-center justify-between text-sm text-slate-500">Completed<span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"><CheckCircle2 className="h-4 w-4"/></span></p><p className="mt-3 text-3xl font-extrabold text-slate-900">{completed}</p><p className="mt-2 text-xs text-slate-400">Conversations marked complete</p></div><div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><p className="flex items-center justify-between text-sm text-slate-500">Meeting details needed<span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700"><Video className="h-4 w-4"/></span></p><p className="mt-3 text-3xl font-extrabold text-slate-900">{needsMeetingLink}</p><p className="mt-2 text-xs text-slate-400">Scheduled interviews without a meeting link</p></div></section>
    <section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-bold text-slate-900">Interview schedule</h2><p className="mt-1 text-xs text-slate-500">{interviews.length} interviews shown</p></div><span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Clock3 className="h-3.5 w-3.5"/>Times shown in your local timezone</span></div><InterviewList interviews={interviews} isStaff={isStaff} onStatusChange={handleStatusChange}/></section>
    <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Schedule an interview" size="md">{applications.length ? <ScheduleInterview applications={applications} onSubmit={handleSchedule} loading={submitting}/> : <div className="py-8 text-center"><p className="text-sm font-semibold text-slate-800">No applications are ready to schedule</p><p className="mt-1 text-xs text-slate-500">Move an application into the interview stage or review your open roles.</p></div>}</Modal>
  </div>;
}
