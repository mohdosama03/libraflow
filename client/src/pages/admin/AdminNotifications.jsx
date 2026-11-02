import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, BookUp, BookDown, ClipboardCheck, ClipboardX, AlarmClock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationService } from '../../services';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/visual';

const ICONS = {
  book_issued: BookUp,
  book_returned: BookDown,
  request_approved: ClipboardCheck,
  request_rejected: ClipboardX,
  due_soon: AlarmClock,
  overdue: AlertTriangle,
  general: Bell,
};

const TONES = {
  book_issued: 'bg-indigo-50 text-indigo-600',
  book_returned: 'bg-emerald-50 text-emerald-600',
  request_approved: 'bg-emerald-50 text-emerald-600',
  request_rejected: 'bg-rose-50 text-rose-600',
  due_soon: 'bg-amber-50 text-amber-600',
  overdue: 'bg-rose-50 text-rose-600',
  general: 'bg-ink/8 text-ink/50',
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const outletCtx = useOutletContext();

  const load = () => {
    setLoading(true);
    setError(null);
    notificationService
      .list()
      .then((d) => setNotifications(d.notifications))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      outletCtx?.refreshUnread?.();
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Notifications</h2>
          <p className="mt-1 text-sm text-ink/50">System activity relevant to library administration.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-outline btn-sm">
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading notifications..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="Admin notifications will appear here." />
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => {
              const Icon = ICONS[n.type] || Bell;
              return (
                <div key={n._id} className={`card flex items-start gap-3.5 p-4 ${!n.isRead ? 'border-indigo-200 bg-indigo-50/30' : ''}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TONES[n.type] || TONES.general}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-ink">{n.title}</p>
                    <p className="mt-0.5 text-sm text-ink/55">{n.message}</p>
                    <p className="mt-1.5 text-xs text-ink/35">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
