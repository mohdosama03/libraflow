import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Library, BookUp, BookCheck, AlertTriangle, Users, Receipt } from 'lucide-react';
import { reportService } from '../../services';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { currency } from '../../utils/visual';

const exportCsv = (filename, rows) => {
  if (!rows.length) return toast.error('Nothing to export yet.');
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const Section = ({ title, action, children }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {action}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    reportService
      .get()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader fullScreen label="Generating report..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { summary, mostBorrowedBooks, mostActiveStudents, categoryStats } = data;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Reports</h2>
          <p className="mt-1 text-sm text-ink/50">A consolidated view of library performance.</p>
        </div>
        <button
          onClick={() =>
            exportCsv('libraflow-summary.csv', [
              { metric: 'Total Books', value: summary.totalBooks },
              { metric: 'Books Issued', value: summary.booksIssued },
              { metric: 'Books Returned', value: summary.booksReturned },
              { metric: 'Overdue Books', value: summary.overdueBooks },
              { metric: 'Total Students', value: summary.totalStudents },
              { metric: 'Fine Collected', value: summary.fineCollected },
              { metric: 'Fine Pending', value: summary.finePending },
            ])
          }
          className="btn-outline"
        >
          <Download className="h-4 w-4" /> Export summary
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Library} label="Total Books" value={summary.totalBooks} tone="indigo" />
        <StatCard icon={BookUp} label="Books Issued" value={summary.booksIssued} tone="marine" />
        <StatCard icon={BookCheck} label="Books Returned" value={summary.booksReturned} tone="emerald" />
        <StatCard icon={AlertTriangle} label="Overdue Books" value={summary.overdueBooks} tone="rose" />
        <StatCard icon={Users} label="Total Students" value={summary.totalStudents} tone="plum" />
        <StatCard icon={Receipt} label="Fine Collected" value={currency(summary.fineCollected)} tone="emerald" />
        <StatCard icon={Receipt} label="Fine Pending" value={currency(summary.finePending)} tone="amber" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section
          title="Most Borrowed Books"
          action={
            <button onClick={() => exportCsv('most-borrowed-books.csv', mostBorrowedBooks)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Export
            </button>
          }
        >
          {mostBorrowedBooks.length === 0 ? (
            <EmptyState title="No data yet" />
          ) : (
            <ul className="space-y-2.5">
              {mostBorrowedBooks.map((b, i) => (
                <li key={b._id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink/70">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">{i + 1}</span>
                    {b.title}
                  </span>
                  <span className="font-semibold text-ink">{b.count}×</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Most Active Students"
          action={
            <button onClick={() => exportCsv('most-active-students.csv', mostActiveStudents)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Export
            </button>
          }
        >
          {mostActiveStudents.length === 0 ? (
            <EmptyState title="No data yet" />
          ) : (
            <ul className="space-y-2.5">
              {mostActiveStudents.map((s, i) => (
                <li key={s._id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink/70">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-plum-50 text-[10px] font-bold text-plum-600">{i + 1}</span>
                    {s.name} <span className="text-ink/35">({s.studentId})</span>
                  </span>
                  <span className="font-semibold text-ink">{s.count} loans</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Category Statistics"
          action={
            <button onClick={() => exportCsv('category-statistics.csv', categoryStats)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Export
            </button>
          }
        >
          {categoryStats.length === 0 ? (
            <EmptyState title="No data yet" />
          ) : (
            <ul className="space-y-2.5">
              {categoryStats.map((c) => (
                <li key={c._id} className="flex items-center justify-between text-sm">
                  <span className="text-ink/70">{c.name}</span>
                  <span className="text-ink/50">{c.titles} titles · {c.totalCopies} copies</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
};

export default Reports;
