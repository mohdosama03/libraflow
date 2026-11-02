import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Hash, CalendarDays, BookCopy, CheckCircle2, Receipt } from 'lucide-react';
import { userService } from '../../services';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import StatCard from '../../components/StatCard.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import BookCover from '../../components/BookCover.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { initialsFor, formatDate, currency } from '../../utils/visual';

const StudentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError(null);
    userService
      .studentDetail(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <Loader fullScreen label="Loading student details..." />;
  if (error || !data) return <ErrorState message={error || 'Student not found'} onRetry={load} />;

  const { student, borrowings, outstandingFines, booksReturned, booksBorrowed } = data;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn-ghost btn-sm mb-4 -ml-3">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to students
      </button>

      <div className="card flex flex-wrap items-center gap-5 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-plum-500 text-xl font-semibold text-white">
          {initialsFor(student.name)}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-semibold text-ink">{student.name}</h2>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/50">
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {student.email}</span>
            {student.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {student.phone}</span>}
            <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> {student.studentId}</span>
            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Joined {formatDate(student.createdAt)}</span>
          </div>
        </div>
        <StatusBadge status={student.isActive ? 'active' : 'inactive'} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={BookCopy} label="Books Borrowed" value={booksBorrowed} tone="indigo" />
        <StatCard icon={CheckCircle2} label="Books Returned" value={booksReturned} tone="emerald" />
        <StatCard icon={Receipt} label="Outstanding Fines" value={currency(outstandingFines)} tone="rose" />
      </div>

      <div className="mt-8">
        <h3 className="font-display text-lg font-semibold text-ink">Borrowing History</h3>
        <div className="mt-4">
          {borrowings.length === 0 ? (
            <EmptyState icon={BookCopy} title="No borrowing history" />
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
                          <BookCover title={b.book?.title} author={b.book?.author} className="h-11 w-9 shrink-0 p-1.5" size="sm" />
                          <span className="font-medium text-ink line-clamp-1">{b.book?.title}</span>
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
    </div>
  );
};

export default StudentDetail;
