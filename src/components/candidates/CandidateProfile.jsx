import { getInitials } from '../../utils/helpers';
import Badge from '../common/Badge';

export default function CandidateProfile({ profile }) {
  if (!profile) return null;
  const user = profile.user_detail || {};
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();

  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {getInitials(name)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">{profile.current_position} {profile.current_company ? `at ${profile.current_company}` : ''}</p>
          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="text-gray-400">Experience</span><p className="font-semibold text-gray-700">{profile.experience_years} years</p></div>
        <div><span className="text-gray-400">Education</span><p className="font-semibold text-gray-700">{profile.education || '—'}</p></div>
        <div><span className="text-gray-400">Expected Salary</span><p className="font-semibold text-gray-700">{profile.expected_salary ? `$${Number(profile.expected_salary).toLocaleString()}` : '—'}</p></div>
        <div><span className="text-gray-400">LinkedIn</span><p className="font-semibold text-primary-600">{profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noreferrer">View Profile</a> : '—'}</p></div>
      </div>

      {profile.skills?.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => <Badge key={s} color="indigo">{s}</Badge>)}
          </div>
        </div>
      )}
    </div>
  );
}
