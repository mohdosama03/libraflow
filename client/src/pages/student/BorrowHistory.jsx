import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import { borrowService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/visual';

const BorrowHistory = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    borrowService
      .list({ limit: 50 })
      .then((d) => setBorrowings(d.borrowings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Borrowing History</h2>
      <p className="mt-1 text-sm text-ink/50">A complete record of every book you&apos;ve borrowed.</p>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading history..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : borrowings.length === 0 ? (
          <EmptyState icon={History} title="No history yet" description="Your past borrowings will appear here once you start reading." />
        ) : (
          <div className="table-shell overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <BookCover title={b.book.title} author={b.book.author} className="h-11 w-9 shrink-0 p-1.5" size="sm" />
                        <span className="font-medium text-ink line-clamp-1">{b.book.title}</span>
                      </div>
                    </td>
                    <td className="text-ink/60">{formatDate(b.issueDate)}</td>
                    <td className="text-ink/60">{formatDate(b.dueDate)}</td>
                    <td className="text-ink/60">{b.returnDate ? formatDate(b.returnDate) : '—'}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowHistory;
