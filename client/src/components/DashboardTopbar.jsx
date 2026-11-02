import { Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';

const DashboardTopbar = ({ title, subtitle, onMenuClick, unreadCount = 0, notificationsPath = '/dashboard/notifications' }) => (
  <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/[0.06] bg-paper/90 px-4 py-4 backdrop-blur-md sm:px-6">
    <div className="flex items-center gap-3">
      <button onClick={onMenuClick} className="rounded-lg p-1.5 text-ink/60 hover:bg-ink/5 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <div>
        <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h1>
        {subtitle && <p className="text-sm text-ink/45">{subtitle}</p>}
      </div>
    </div>

    <Link to={notificationsPath} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft">
      <Bell className="h-4.5 w-4.5 text-ink/60" strokeWidth={1.75} />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  </div>
);

export default DashboardTopbar;
