import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, PanelLeftClose, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';

export default function Navbar({ sidebarOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className={`fixed top-0 right-0 z-40 bg-white border-b border-gray-100 transition-all duration-300 ${sidebarOpen ? 'md:left-64 left-0' : 'left-0'}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        {/* Toggle Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200"
            title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm tracking-tight">SH</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900 leading-none">SmartHire</h1>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">AI Recruitment Management</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 sm:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates, jobs, interviews..."
              className="w-full pl-10 pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/notifications-page')}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px] text-gray-500" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">3</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 pl-2 sm:pl-3 pr-2 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.first_name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.first_name + ' ' + (user?.last_name || 'Admin'))
                )}
              </div>
              <span className="hidden md:inline text-xs font-medium text-gray-700">
                {user?.first_name || 'Admin'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@smarthire.com'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded capitalize">
                    {user?.role || 'Admin'}
                  </span>
                </div>
                <button
                  onClick={() => { navigate('/profile'); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Profile & Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <nav className="flex items-center gap-1 px-4 sm:px-6 h-10 border-t border-gray-50 overflow-x-auto no-scrollbar">
        {NAV_ITEMS.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `px-3 py-1.5 text-xs sm:text-[13px] font-medium rounded-md whitespace-nowrap transition-colors ${
                isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
