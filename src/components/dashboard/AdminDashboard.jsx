import { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  FolderOpen,
  CalendarDays,
  ShieldCheck,
  Activity,
  Server,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { getAdminStats } from '../../api/dashboard';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      setData(res.data);
    } catch {
      setData(null);
      toast.error('Could not load platform data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const usersList = data?.recent_users || [];
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-300 border border-white/15 mb-2">
            <Server className="w-3.5 h-3.5 text-amber-300" />
            <span>SmartHire Central Administration Console</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Platform Telemetry & Governance</h1>
          <p className="text-xs text-indigo-200/80 mt-1">
            Global management of user identities, role permissions, active vacancies, and system workers.
          </p>
        </div>

        {/* System Health Indicators */}
        <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-xl border border-white/10 backdrop-blur-sm self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{data ? 'Live platform data' : 'Data unavailable'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Skills-based matching</span>
          </div>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{data?.users?.total ?? 0}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
            <span className="text-indigo-600 font-semibold">{data?.users?.recruiters ?? 0} Recruiters</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">{data?.users?.candidates ?? 0} Candidates</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Vacancies</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{data?.platform?.total_jobs ?? 0}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{data?.platform?.active_jobs ?? 0} Active Postings</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Candidate Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{data?.platform?.total_applications ?? 0}</p>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold pt-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Applications across the platform</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Interviews</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{data?.platform?.total_interviews ?? 0}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>High conversion throughput</span>
          </div>
        </div>
      </div>

      {/* User Directory & Governance Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">User Identity & Access Governance</h2>
            <p className="text-xs text-gray-500">Manage user accounts, view active roles, and audit account status.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-700 outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins</option>
              <option value="RECRUITER">Recruiters</option>
              <option value="CANDIDATE">Candidates</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">User / Name</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Verification</th>
                <th className="pb-3">Member Since</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        {u.full_name ? u.full_name[0] : 'U'}
                      </div>
                      <span className="font-semibold text-gray-800 text-xs">{u.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-xs text-gray-600 font-mono">{u.email}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : u.role === 'RECRUITER'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    {u.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-xs text-gray-500">{u.date_joined}</td>
                  <td className="py-3.5 text-right pr-2">
                    <span className="px-2.5 py-1 text-[11px] font-medium text-gray-400">View only</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
