import { NavLink, Link } from 'react-router-dom';
import { BookMarked, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { initialsFor } from '../utils/visual';

const Sidebar = ({ links, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-ink px-4 py-6">
      <Link to="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <BookMarked className="h-4.5 w-4.5 text-white" strokeWidth={2} />
        </span>
        <span className="font-display text-lg font-semibold text-white">LibraFlow</span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
        {links.map((section, idx) => (
          <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
            {section.heading && (
              <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                {section.heading}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-plum-500 text-xs font-semibold text-white">
            {initialsFor(user?.name || 'U')}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/40">{user?.role === 'admin' ? 'Librarian' : user?.studentId}</p>
          </div>
        </div>
        <button onClick={logout} className="sidebar-link mt-1 w-full text-white/55">
          <LogOut className="h-4.5 w-4.5" strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
