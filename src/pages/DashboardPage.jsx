import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import CandidateDashboard from '../components/dashboard/CandidateDashboard';
import ApplicationStatusCards from '../components/dashboard/ApplicationStatusCards';
import JobsOverview from '../components/dashboard/JobsOverview';
import RequestsSidebar from '../components/dashboard/RequestsSidebar';
import UpcomingInterviews from '../components/dashboard/UpcomingInterviews';
import DashboardStats from '../components/dashboard/DashboardStats';
import { Crown, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const currentRole = user?.role || 'RECRUITER';
  const [activeRole, setActiveRole] = useState(currentRole);

  return (
    <div className="space-y-6">
      {/* Role Navigation Bar - Enterprise Multi-Role Switcher */}
      <div className="bg-white rounded-2xl p-3 px-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Workspace:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                activeRole === 'ADMIN'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : activeRole === 'CANDIDATE'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-300'
              }`}
            >
              {activeRole === 'ADMIN' && <Crown className="w-3.5 h-3.5 text-amber-600" />}
              {activeRole === 'CANDIDATE' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
              {activeRole === 'RECRUITER' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
              <span>
                {activeRole === 'ADMIN' ? 'Platform Admin Console' : activeRole === 'CANDIDATE' ? 'Candidate Career Portal' : 'Recruiter ATS Workspace'}
              </span>
            </span>
          </div>

          {activeRole !== currentRole && (
            <button
              onClick={() => setActiveRole(currentRole)}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
            >
              Reset to Account Default ({currentRole})
            </button>
          )}
        </div>

        {/* 1-Click Role Switcher Tabs */}
        <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => setActiveRole('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'ADMIN'
                ? 'bg-white text-indigo-900 shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('RECRUITER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'RECRUITER'
                ? 'bg-white text-indigo-900 shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Recruiter ATS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('CANDIDATE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeRole === 'CANDIDATE'
                ? 'bg-white text-indigo-900 shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Candidate Portal</span>
          </button>
        </div>
      </div>

      {/* Render Dedicated Role Dashboards */}
      {activeRole === 'ADMIN' && <AdminDashboard />}

      {activeRole === 'CANDIDATE' && <CandidateDashboard />}

      {activeRole === 'RECRUITER' && (
        <div className="space-y-6">
          <DashboardStats />
          <div className="grid grid-cols-12 gap-5">
            {/* Left: Requests */}
            <div className="col-span-12 lg:col-span-2">
              <RequestsSidebar />
            </div>

            {/* Center: Status + Jobs */}
            <div className="col-span-12 lg:col-span-7 space-y-5">
              <ApplicationStatusCards />
              <JobsOverview />
            </div>

            {/* Right: Interviews */}
            <div className="col-span-12 lg:col-span-3">
              <UpcomingInterviews />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
