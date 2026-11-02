import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookCopy } from 'lucide-react';
import { borrowService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate, daysUntil } from '../../utils/visual';

const statusFor = (b) => {
  if (b.status === 'overdue') return 'overdue';
  const days = daysUntil(b.dueDate);
  if (days < 0) return 'overdue';
  if (days <= 3) return 'due soon';
  return 'issued';
};

const MyBorrowed = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    borrowService
      .myCurrent()
      .then((d) => setBorrowings(d.borrowings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">My Borrowed Books</h2>
      <p className="mt-1 text-sm text-ink/50">Books currently checked out on your account.</p>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading your borrowed books..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : borrowings.length === 0 ? (
          <EmptyState
            icon={BookCopy}
            title="You have no books borrowed"
            description="Browse the catalog to find your next read."
            action={
              <Link to="/books" className="btn-accent btn-sm">
                Explore Books
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {borrowings.map((b) => {
              const days = daysUntil(b.dueDate);
              return (
                <div key={b._id} className="card flex gap-4 p-4">
                  <BookCover title={b.book.title} author={b.book.author} className="h-28 w-20 shrink-0 p-2" />
                  <div className="flex-1">
                    <StatusBadge status={statusFor(b)} />
                    <p className="mt-2 font-display text-sm font-semibold leading-snug text-ink line-clamp-2">{b.book.title}</p>
                    <p className="mt-0.5 text-xs text-ink/45">{b.book.author}</p>
                    <div className="mt-3 space-y-1 text-xs text-ink/55">
                      <p>Issued: {formatDate(b.issueDate)}</p>
                      <p>Due: {formatDate(b.dueDate)}</p>
                      <p className={days < 0 ? 'font-semibold text-rose-600' : days <= 3 ? 'font-semibold text-amber-600' : ''}>
                        {days < 0 ? `${Math.abs(days)} day(s) overdue` : days === 0 ? 'Due today' : `${days} day(s) remaining`}
                      </p>
                    </div>
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

export default MyBorrowed;
