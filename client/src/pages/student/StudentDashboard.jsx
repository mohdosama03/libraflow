import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookCopy, CheckCircle2, ClipboardList, Receipt, ArrowUpRight, Sparkles } from 'lucide-react';
import { dashboardService, bookService } from '../../services';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import BookCover from '../../components/BookCover.jsx';
import BookCard from '../../components/BookCard.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate, daysUntil, currency } from '../../utils/visual';

const dueStatus = (dueDate, status) => {
  if (status === 'returned') return 'returned';
  const days = daysUntil(dueDate);
  if (status === 'overdue' || days < 0) return 'overdue';
  if (days <= 3) return 'due soon';
  return 'available';
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([dashboardService.student(), bookService.recommendations()])
      .then(([dashRes, recRes]) => {
        setData(dashRes);
        setRecommendations(recRes.books);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader fullScreen label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { stats, recentBorrowings } = data;

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Welcome, {user.name.split(' ')[0]}</h2>
      <p className="mt-1 text-sm text-ink/50">Here&apos;s what&apos;s happening with your library account.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookCopy} label="Currently Borrowed" value={stats.currentlyBorrowed} tone="indigo" />
        <StatCard icon={CheckCircle2} label="Books Returned" value={stats.returned} tone="emerald" />
        <StatCard icon={ClipboardList} label="Pending Requests" value={stats.pendingRequests} tone="amber" />
        <StatCard icon={Receipt} label="Current Fine" value={currency(stats.currentFine)} tone="rose" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">Recent Activity</h3>
        <Link to="/dashboard/history" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4">
        {recentBorrowings.length === 0 ? (
          <EmptyState icon={BookCopy} title="No borrowing activity yet" description="Books you borrow will show up here." />
        ) : (
          <div className="table-shell overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBorrowings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <BookCover title={b.book.title} author={b.book.author} className="h-11 w-9 shrink-0 p-1.5" size="sm" />
                        <span className="font-medium text-ink line-clamp-1">{b.book.title}</span>
                      </div>
                    </td>
                    <td className="text-ink/60">{formatDate(b.issueDate)}</td>
                    <td className="text-ink/60">{formatDate(b.dueDate)}</td>
                    <td>
                      <StatusBadge status={dueStatus(b.dueDate, b.status)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-plum-500" />
            <h3 className="font-display text-lg font-semibold text-ink">Recommended for you</h3>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
