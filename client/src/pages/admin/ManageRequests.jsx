import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ClipboardList, Check, X as XIcon } from 'lucide-react';
import { requestService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate, initialsFor } from '../../utils/visual';

const TABS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All' },
];

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('pending');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    requestService
      .list(tab ? { status: tab } : {})
      .then((d) => setRequests(d.requests))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await requestService.updateStatus(id, status);
      toast.success(`Request marked as ${status}.`);
      setRequests((prev) => prev.filter((r) => r._id !== id || tab === ''));
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Book Requests</h2>
      <p className="mt-1 text-sm text-ink/50">Review and act on student book requests.</p>

      <div className="mt-5 flex gap-1.5 rounded-full bg-ink/[0.05] p-1 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              tab === t.value ? 'bg-white text-ink shadow-soft' : 'text-ink/45'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader label="Loading requests..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : requests.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No requests here" description="Requests matching this filter will appear here." />
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r._id} className="card flex flex-wrap items-center gap-4 p-4">
                <BookCover title={r.book?.title} author={r.book?.author} className="h-16 w-12 shrink-0 p-1.5" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-ink line-clamp-1">{r.book?.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-ink/50">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-semibold text-indigo-700">
                      {initialsFor(r.user?.name)}
                    </div>
                    {r.user?.name} · {r.user?.studentId}
                  </div>
                  <p className="mt-1 text-xs text-ink/40">Requested {formatDate(r.createdAt)}</p>
                  {r.note && <p className="mt-1 text-xs italic text-ink/45">&ldquo;{r.note}&rdquo;</p>}
                </div>
                <StatusBadge status={r.status} />
                {r.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(r._id, 'approved')}
                      disabled={busyId === r._id}
                      className="btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button onClick={() => updateStatus(r._id, 'rejected')} disabled={busyId === r._id} className="btn-outline btn-sm text-rose-600">
                      <XIcon className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
