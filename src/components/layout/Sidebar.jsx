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
  Crown,
  UserCheck,
  FileText,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getMediaUrl } from '../../utils/constants';

export default function Sidebar({ isOpen, toggleSidebar, closeSidebar }) {
  const { user } = useAuth();
  const role = user?.role || 'RECRUITER';

  // Role-Specific Navigation Links
  const getNavLinks = () => {
    if (role === 'ADMIN') {
      return [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Admin Console', badge: null },
        { to: '/talent-pool', icon: Users, label: 'User Directory', badge: null },
        { to: '/jobs', icon: Briefcase, label: 'Job Moderation', badge: null },
        { to: '/applications', icon: FolderOpen, label: 'Applications Audit', badge: null },
        { to: '/interviews', icon: CalendarDays, label: 'Interviews Schedule', badge: null },
        { to: '/reports', icon: BarChart3, label: 'Platform Telemetry', badge: null },
        { to: '/profile', icon: Settings, label: 'System Settings', badge: null },
      ];
    }

    if (role === 'CANDIDATE') {
      return [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Career Dashboard', badge: null },
        { to: '/jobs', icon: Briefcase, label: 'Explore Open Jobs', badge: null },
        { to: '/applications', icon: FileText, label: 'My Applications', badge: null },
        { to: '/interviews', icon: CalendarDays, label: 'My Interviews', badge: null },
        { to: '/profile', icon: Sparkles, label: 'Resume & Skills AI', badge: null },
        { to: '/notifications-page', icon: Bell, label: 'Notifications', badge: null },
      ];
    }

    // Default: RECRUITER
    return [
      { to: '/dashboard', icon: LayoutDashboard, label: 'ATS Dashboard', badge: null },
      { to: '/applications', icon: FolderOpen, label: 'Candidate Pipeline', badge: null },
      { to: '/jobs', icon: Briefcase, label: 'Job Openings', badge: null },
      { to: '/talent-pool', icon: Users, label: 'AI Talent Pool', badge: null },
      { to: '/interviews', icon: CalendarDays, label: 'Interviews', badge: null },
      { to: '/reports', icon: BarChart3, label: 'Hiring Analytics', badge: null },
      { to: '/notifications-page', icon: Bell, label: 'Notifications', badge: null },
      { to: '/profile', icon: Settings, label: 'Profile Settings', badge: null },
    ];
  };

  const links = getNavLinks();

  const getRoleBadge = () => {
    if (role === 'ADMIN') {
      return {
        label: 'Admin workspace',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: Crown,
      };
    }
    if (role === 'CANDIDATE') {
      return {
        label: 'Candidate workspace',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: UserCheck,
      };
    }
    return {
      label: 'Recruiter workspace',
      color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: ShieldCheck,
    };
  };

  const roleBadge = getRoleBadge();
  const RoleBadgeIcon = roleBadge.icon;

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
        className={`fixed top-0 left-0 h-screen w-[260px] bg-[#102b27] text-white z-50 flex flex-col shadow-xl shadow-slate-900/10 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c8f169] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#163c34]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">SmartHire</span>
              <span className="block text-[10px] text-emerald-100/60 font-medium">
                {role === 'ADMIN' ? 'Admin Portal' : role === 'CANDIDATE' ? 'Career Portal' : 'ATS Workspace'}
              </span>
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

        {/* Role Identity Tag */}
        <div className="px-4 py-2.5 mx-4 my-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RoleBadgeIcon className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-semibold text-white">{roleBadge.label}</span>
          </div>
          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${roleBadge.color}`}>
            {role}
          </span>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2 flex-1 overflow-y-auto space-y-1">
          <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-indigo-300/50 mb-2">
            {role === 'ADMIN' ? 'System Management' : role === 'CANDIDATE' ? 'My Career Workspace' : 'Recruitment Pipeline'}
          </p>
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
                    ? 'bg-[#c8f169] text-[#193d34] shadow-sm font-bold'
                    : 'text-emerald-50/65 hover:bg-white/10 hover:text-white'
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

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shrink-0">
              {user?.avatar ? (
                <img src={getMediaUrl(user.avatar)} alt={user?.first_name || 'User'} className="w-full h-full object-cover" />
              ) : (
                user?.first_name ? user.first_name[0] : 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.first_name} {user?.last_name || ''}
              </p>
              <p className="text-[11px] text-indigo-300 truncate">{user?.email || 'user@smarthire.com'}</p>
            </div>
            {user?.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified account" />}
          </div>
        </div>
      </aside>
    </>
  );
}
