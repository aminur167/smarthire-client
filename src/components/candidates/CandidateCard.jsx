import { getInitials } from '../../utils/helpers';

export default function CandidateCard({ candidate, onClick }) {
  const profile = candidate.candidate_profile || candidate;
  const user = profile.user_detail || profile.user || candidate;
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

  return (
    <div onClick={() => onClick?.(candidate)} className="card hover:shadow-md transition-all cursor-pointer group hover:border-primary-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {getInitials(name)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{name}</h3>
          <p className="text-xs text-gray-400">{profile.current_position || 'Candidate'} {profile.current_company ? `at ${profile.current_company}` : ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span>📧 {user.email}</span>
        {profile.experience_years > 0 && <span>🕐 {profile.experience_years}y exp</span>}
      </div>
      {profile.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map((s) => <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-medium">{s}</span>)}
          {profile.skills.length > 4 && <span className="text-[10px] text-gray-400">+{profile.skills.length - 4}</span>}
        </div>
      )}
    </div>
  );
}
