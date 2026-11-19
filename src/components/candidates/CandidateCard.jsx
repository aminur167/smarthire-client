import { BriefcaseBusiness, Mail, MapPin } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

export default function CandidateCard({ candidate, onClick }) {
  const profile = candidate.candidate_profile || candidate;
  const user = profile.user_detail || profile.user || candidate;
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Candidate';
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  return (
    <button type="button" onClick={() => onClick(profile)} className="card group w-full text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf7e2] text-sm font-bold text-[#315d37]">{getInitials(name)}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-slate-900">{name}</span>
          <span className="mt-1 block truncate text-xs text-slate-500">{profile.current_position || 'Candidate profile'}</span>
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{profile.experience_years || 0} yrs</span>
      </div>
      <span className="mt-4 flex items-center gap-2 truncate text-xs text-slate-500"><Mail className="h-3.5 w-3.5 shrink-0"/>{user.email || 'Email unavailable'}</span>
      {profile.current_company && <span className="mt-2 flex items-center gap-2 truncate text-xs text-slate-500"><BriefcaseBusiness className="h-3.5 w-3.5 shrink-0"/>{profile.current_company}</span>}
      {profile.location && <span className="mt-2 flex items-center gap-2 truncate text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 shrink-0"/>{profile.location}</span>}
      <span className="mt-4 flex min-h-6 flex-wrap gap-1.5">
        {skills.slice(0, 4).map((skill) => <span key={skill} className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-800">{skill}</span>)}
        {skills.length > 4 && <span className="px-1 py-1 text-[10px] text-slate-400">+{skills.length - 4}</span>}
        {!skills.length && <span className="text-[11px] text-slate-400">No skills added yet</span>}
      </span>
    </button>
  );
}
