import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';

export default function SubNav() {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-1 px-6 py-1 bg-white border-b border-gray-100">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
