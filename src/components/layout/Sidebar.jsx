import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarDays,
  Settings,
  BarChart3,
  Bell,
  FolderOpen,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { to: '/applications', icon: FolderOpen, label: 'Applications', badge: '21' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs Overview', badge: '10' },
  { to: '/talent-pool', icon: Users, label: 'Talent Pool', badge: '15' },
  { to: '/interviews', icon: CalendarDays, label: 'Interviews', badge: '8' },
  { to: '/reports', icon: BarChart3, label: 'Analytics & Reports', badge: null },
  { to: '/notifications-page', icon: Bell, label: 'Notifications', badge: '3' },
  { to: '/profile', icon: Settings, label: 'Settings', badge: null },
];

export default function Sidebar({ isOpen, toggleSidebar, closeSidebar }) {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide text-white">SmartHire AI</span>
              <span className="block text-[10px] text-indigo-300 font-medium">ATS Platform</span>
            </div>
          </div>
          {/* Close/Hide button inside sidebar */}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Hide Sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* AI Status Badge */}
        <div className="px-4 py-3 mx-4 my-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-indigo-200">AI Engine Active</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">v2.4</span>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2 flex-1 overflow-y-auto space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-indigo-300/60 mb-2">Navigation</p>
          {links.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => {
                if (window.innerWidth < 768) closeSidebar();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                    : 'text-indigo-200/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </div>
              {badge && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-white/15 text-indigo-100">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Recruiter / User Profile Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
              {user?.first_name ? user.first_name[0] : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.first_name} {user?.last_name || 'Admin'}</p>
              <p className="text-[11px] text-indigo-300 truncate">{user?.email || 'admin@smarthire.com'}</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Recruiter" />
          </div>
        </div>
      </aside>
    </>
  );
}
