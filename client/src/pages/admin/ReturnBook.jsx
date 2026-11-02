import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, BookDown, AlertTriangle } from 'lucide-react';
import { borrowService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { formatDate, daysUntil, currency, initialsFor } from '../../utils/visual';

const ReturnBook = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState(null);
  const [returning, setReturning] = useState(false);
  const [result, setResult] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([borrowService.list({ status: 'issued', limit: 100 }), borrowService.list({ status: 'overdue', limit: 100 })])
      .then(([issuedRes, overdueRes]) => {
        const merged = [...issuedRes.borrowings, ...overdueRes.borrowings].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setBorrowings(merged);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = borrowings.filter((b) => {
    const q = search.toLowerCase();
    return (
      !q ||
      b.book.title.toLowerCase().includes(q) ||
      b.user.name.toLowerCase().includes(q) ||
      b.user.studentId?.toLowerCase().includes(q)
    );
  });

  const handleReturn = async () => {
    setReturning(true);
    try {
      const res = await borrowService.return(target._id);
      toast.success('Book returned successfully.');
      setResult(res);
      setTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReturning(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Return Book</h2>
      <p className="mt-1 text-sm text-ink/50">Process a return and automatically calculate any late fine.</p>

      {result && (
        <div className="stamp-card mt-5 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <BookDown className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="text-sm">
            <p className="font-display font-semibold text-ink">Return processed</p>
            <p className="mt-0.5 text-ink/55">
              {result.lateDays > 0
                ? `Returned ${result.lateDays} day(s) late — a fine of ${currency(result.fine?.amount)} has been recorded.`
                : 'Returned on time — no fine applied.'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1 shadow-soft sm:max-w-sm">
        <Search className="h-4 w-4 text-ink/35" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by book, student or ID..."
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/35"
        />
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader label="Loading issued books..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={BookDown} title="No books currently issued" description="All books are checked in." />
        ) : (
          <div className="table-shell overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Student</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const days = daysUntil(b.dueDate);
                  const overdue = days < 0;
                  return (
                    <tr key={b._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <BookCover title={b.book.title} author={b.book.author} className="h-11 w-9 shrink-0 p-1.5" size="sm" />
                          <span className="font-medium text-ink line-clamp-1">{b.book.title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
                            {initialsFor(b.user.name)}
                          </div>
                          <div>
                            <p className="text-sm text-ink">{b.user.name}</p>
                            <p className="text-xs text-ink/40">{b.user.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-ink/60">{formatDate(b.issueDate)}</td>
                      <td className="text-ink/60">{formatDate(b.dueDate)}</td>
                      <td>
                        <StatusBadge status={overdue ? 'overdue' : days <= 3 ? 'due soon' : 'issued'} />
                      </td>
                      <td className="text-right">
                        <button onClick={() => setTarget(b)} className="btn-outline btn-sm">
                          <BookDown className="h-3.5 w-3.5" /> Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        title={`Return "${target?.book.title}"?`}
        description={
          target && daysUntil(target.dueDate) < 0
            ? `This book is ${Math.abs(daysUntil(target.dueDate))} day(s) overdue. A late fine will be calculated automatically.`
            : 'This book will be marked as returned and the copy released back to the catalog.'
        }
        confirmLabel="Confirm return"
        danger={false}
        onConfirm={handleReturn}
        onClose={() => setTarget(null)}
        loading={returning}
      />
    </div>
  );
};

export default ReturnBook;
