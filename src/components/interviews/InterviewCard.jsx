import { CalendarDays, Clock3, Code2, MapPin, Phone, UserRound, Video } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/helpers';

const typeIcons = { VIDEO: Video, PHONE: Phone, IN_PERSON: UserRound, TECHNICAL: Code2, HR: UserRound };
const statusColors = { SCHEDULED: 'green', COMPLETED: 'blue', CANCELLED: 'red', RESCHEDULED: 'amber', NO_SHOW: 'gray' };
const statusLabels = { SCHEDULED: 'Scheduled', COMPLETED: 'Completed', CANCELLED: 'Cancelled', RESCHEDULED: 'Rescheduled', NO_SHOW: 'No show' };
const statuses = ['SCHEDULED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW'];

export default function InterviewCard({ interview, isStaff = false, onStatusChange }) {
  const Icon = typeIcons[interview.interview_type] || CalendarDays;
  const application = interview.application_detail;
  const candidate = application?.candidate_detail;
  const interviewer = interview.interviewer_detail;
  return <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf7e2] text-[#47713a]"><Icon className="h-4 w-4"/></span><div className="min-w-0"><h3 className="truncate text-sm font-bold text-slate-900">{application?.job_detail?.title || 'Interview'}</h3><p className="mt-1 text-xs text-slate-500">{interview.interview_type?.replaceAll('_', ' ') || 'Interview'} · {interview.duration_minutes} min</p></div></div><Badge color={statusColors[interview.status] || 'gray'}>{statusLabels[interview.status] || interview.status}</Badge></div>
    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600"><p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-slate-400"/>{formatDate(interview.scheduled_at)} at {formatTime(interview.scheduled_at)}</p>{candidate && <p className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5 text-slate-400"/>{candidate.first_name} {candidate.last_name}</p>}{interviewer && <p className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5 text-slate-400"/>Interviewer: {interviewer.first_name} {interviewer.last_name}</p>}{interview.location && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-400"/>{interview.location}</p>}</div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">{interview.meeting_link ? <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700"><Video className="h-3.5 w-3.5"/>Open meeting link</a> : <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Clock3 className="h-3.5 w-3.5"/>No meeting link provided</span>}{isStaff && interview.status !== 'CANCELLED' && <select aria-label="Update interview status" value={interview.status} onChange={(event) => onStatusChange?.(interview, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50">{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select>}</div>
  </article>;
}
