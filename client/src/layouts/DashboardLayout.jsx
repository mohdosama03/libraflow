import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import DashboardTopbar from '../components/DashboardTopbar.jsx';
import { notificationService } from '../services';

const DashboardLayout = ({ links, title, subtitle, notificationsPath }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    notificationService
      .list()
      .then((data) => mounted && setUnreadCount(data.unreadCount))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="hidden lg:block">
        <Sidebar links={links} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative">
            <Sidebar links={links} onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setMobileOpen(true)}
          unreadCount={unreadCount}
          notificationsPath={notificationsPath}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet context={{ refreshUnread: () => notificationService.list().then((d) => setUnreadCount(d.unreadCount)) }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
