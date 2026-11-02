import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { requestService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/visual';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    requestService
      .list()
      .then((d) => setRequests(d.requests))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">My Requests</h2>
      <p className="mt-1 text-sm text-ink/50">Books you&apos;ve requested from the library desk.</p>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading requests..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No requests yet"
            description="Request a book straight from its detail page and track the status here."
            action={
              <Link to="/books" className="btn-accent btn-sm">
                Browse Books
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r._id} className="card flex items-center gap-4 p-4">
                <BookCover title={r.book?.title} author={r.book?.author} className="h-16 w-12 shrink-0 p-1.5" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-ink line-clamp-1">{r.book?.title}</p>
                  <p className="text-xs text-ink/45">Requested on {formatDate(r.createdAt)}</p>
                  {r.note && <p className="mt-1 text-xs italic text-ink/40">&ldquo;{r.note}&rdquo;</p>}
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
