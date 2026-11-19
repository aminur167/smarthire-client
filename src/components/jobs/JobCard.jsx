import { MapPin, Clock, DollarSign, Users } from 'lucide-react';
import Badge from '../common/Badge';

export default function JobCard({ job, onClick }) {
  const statusColor = { PUBLISHED: 'green', ON_HOLD: 'amber', DRAFT: 'gray', CLOSED: 'red' };
  return (
    <button type="button" onClick={() => onClick?.(job)} className="card w-full text-left hover:shadow-md transition-all cursor-pointer group hover:border-primary-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-800 group-hover:text-primary-600 transition-colors">{job.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{job.department_detail?.name || job.department || 'General'}</p>
        </div>
        <Badge color={statusColor[job.status] || 'gray'}>{job.status?.replace('_', ' ') || 'Draft'}</Badge>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location || 'Remote'}</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.job_type?.replace('_', ' ') || 'Full Time'}</span>
        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.openings} openings</span>
      </div>
      {(job.salary_min || job.salary_max) && (
        <p className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
          <DollarSign className="w-3.5 h-3.5" />
          {job.salary_min ? `$${Number(job.salary_min).toLocaleString()}` : ''} - {job.salary_max ? `$${Number(job.salary_max).toLocaleString()}` : ''}
        </p>
      )}
      {job.skills_required?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.skills_required.slice(0, 5).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-medium">{s}</span>
          ))}
          {job.skills_required.length > 5 && <span className="text-[10px] text-gray-400">+{job.skills_required.length - 5}</span>}
        </div>
      )}
    </button>
  );
}
