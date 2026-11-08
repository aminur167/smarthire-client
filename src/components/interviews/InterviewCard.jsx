import { Video, Phone, User, Code, Calendar } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/helpers';

const typeIcons = { VIDEO: Video, PHONE: Phone, IN_PERSON: User, TECHNICAL: Code, HR: User };
const statusColors = { SCHEDULED: 'blue', COMPLETED: 'green', CANCELLED: 'red', RESCHEDULED: 'amber', NO_SHOW: 'gray' };

export default function InterviewCard({ interview, onClick }) {
  const Icon = typeIcons[interview.interview_type] || Calendar;
  return (
    <div onClick={() => onClick?.(interview)} className="card hover:shadow-md transition-all cursor-pointer group hover:border-primary-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">{interview.application_detail?.job_detail?.title || 'Interview'}</h3>
            <p className="text-xs text-gray-400">{interview.interview_type?.replace('_', ' ')} • {interview.duration_minutes} min</p>
          </div>
        </div>
        <Badge color={statusColors[interview.status] || 'gray'}>{interview.status}</Badge>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(interview.scheduled_at)}</span>
        <span>{formatTime(interview.scheduled_at)}</span>
      </div>
      {interview.application_detail?.candidate_detail && (
        <p className="text-xs text-gray-400 mt-2">Candidate: {interview.application_detail.candidate_detail.first_name} {interview.application_detail.candidate_detail.last_name}</p>
      )}
    </div>
  );
}
