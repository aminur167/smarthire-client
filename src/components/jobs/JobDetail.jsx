import { MapPin, Clock, DollarSign, Users, ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function JobDetail({ job, onApply, onBack, alreadyApplied = false }) {
  if (!job) return null;
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.department_detail?.name || 'General'}</p>
          </div>
          <Badge color={job.status === 'PUBLISHED' ? 'green' : 'amber'}>{job.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{job.job_type?.replace('_', ' ')}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{job.openings} openings</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Deadline: {job.deadline}</span>
          {job.salary_min && <span className="flex items-center gap-1.5 text-emerald-600 font-semibold"><DollarSign className="w-4 h-4" />${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}</span>}
        </div>
        <div className="space-y-5">
          <div><h3 className="font-semibold text-gray-800 mb-2">Description</h3><p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p></div>
          <div><h3 className="font-semibold text-gray-800 mb-2">Requirements</h3><p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.requirements}</p></div>
          {job.responsibilities && <div><h3 className="font-semibold text-gray-800 mb-2">Responsibilities</h3><p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.responsibilities}</p></div>}
        </div>
        {job.skills_required?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills_required.map((s) => <span key={s} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">{s}</span>)}
            </div>
          </div>
        )}
        {onApply && <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5">{alreadyApplied ? <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4"/>Application submitted</span> : <Button onClick={() => onApply(job)}>Apply for this role</Button>}<span className="text-xs text-gray-400">You can track your application from your workspace.</span></div>}
      </div>
    </div>
  );
}
