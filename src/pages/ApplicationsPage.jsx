import { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus } from '../api/candidates';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const statuses = ['ALL', 'NEW', 'SCREENING', 'QUALIFIED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFERED', 'HIRED', 'REJECTED'];

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'RECRUITER';

  useEffect(() => { loadApps(); }, []);

  const loadApps = async () => {
    setLoading(true);
    try { const { data } = await getApplications(); setApps(data?.results || data || []); }
    catch { toast.error('Failed to load applications'); }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try { await updateApplicationStatus(id, { status: newStatus }); toast.success('Status updated'); loadApps(); }
    catch { toast.error('Update failed'); }
  };

  const filtered = apps.filter((a) => {
    const matchSearch = (a.candidate_detail?.first_name + ' ' + a.candidate_detail?.last_name + ' ' + a.job_detail?.title).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || a.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Applications</h1>
      <p className="text-sm text-gray-500 mb-6">{apps.length} total applications</p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex-1 min-w-[200px]"><SearchBar value={search} onChange={setSearch} placeholder="Search by candidate or job..." /></div>
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase">Candidate</th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase">Job</th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase">Applied</th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="pb-3 text-xs font-medium text-gray-400 uppercase text-center">Match Score</th>
              {isStaff && <th className="pb-3 text-xs font-medium text-gray-400 uppercase">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="py-3 pr-4">
                  <p className="font-medium text-gray-700">{app.candidate_detail?.first_name} {app.candidate_detail?.last_name}</p>
                  <p className="text-xs text-gray-400">{app.candidate_detail?.email}</p>
                </td>
                <td className="py-3 pr-4 text-gray-600">{app.job_detail?.title}</td>
                <td className="py-3 pr-4 text-gray-500 text-xs">{formatDate(app.applied_at)}</td>
                <td className="py-3 pr-4"><StatusBadge status={app.status} /></td>
                <td className="py-3 pr-4 text-center">
                  <span className={`font-bold text-sm ${app.ai_match_score >= 70 ? 'text-emerald-600' : app.ai_match_score >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                    {app.ai_match_score?.toFixed(0) || '—'}%
                  </span>
                </td>
                {isStaff && (
                  <td className="py-3">
                    <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-300">
                      {statuses.filter((s) => s !== 'ALL').map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No applications found</p>}
      </div>
    </div>
  );
}
