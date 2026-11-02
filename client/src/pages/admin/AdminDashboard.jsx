import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Library, BookOpen, BookUp, Users, AlertTriangle, Receipt } from 'lucide-react';
import { dashboardService } from '../../services';
import StatCard from '../../components/StatCard.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { currency } from '../../utils/visual';

const PIE_COLORS = ['#5B5FE0', '#7F3FCF', '#255FB0', '#9C5CEB', '#3F7CD3', '#B983FA'];

const ChartCard = ({ title, subtitle, children }) => (
  <div className="card p-5">
    <p className="font-display text-sm font-semibold text-ink">{title}</p>
    {subtitle && <p className="text-xs text-ink/45">{subtitle}</p>}
    <div className="mt-4 h-64">{children}</div>
  </div>
);

const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: '1px solid rgba(20,26,46,0.08)', fontSize: 12.5, fontFamily: 'Inter' },
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    dashboardService
      .admin()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader fullScreen label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { stats, charts } = data;
  const hasActivity = charts.issuedByMonth.length > 0 || charts.returnedByMonth.length > 0;

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Circulation Overview</h2>
      <p className="mt-1 text-sm text-ink/50">A real-time snapshot of the LibraFlow library.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Library} label="Total Books" value={stats.totalBooks} tone="indigo" />
        <StatCard icon={BookOpen} label="Available Books" value={stats.availableBooks} tone="emerald" />
        <StatCard icon={BookUp} label="Issued Books" value={stats.issuedBooks} tone="marine" />
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} tone="plum" />
        <StatCard icon={AlertTriangle} label="Overdue Books" value={stats.overdueBooks} tone="rose" />
        <StatCard icon={Receipt} label="Total Fines" value={currency(stats.totalFines)} tone="amber" />
      </div>

      {!hasActivity ? (
        <div className="mt-8">
          <EmptyState title="Not enough data yet" description="Charts will populate once books start being issued and returned." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard title="Books Issued per Month" subtitle="Last 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.issuedByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,26,46,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" fill="#5B5FE0" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Books Returned per Month" subtitle="Last 6 months">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.returnedByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,26,46,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#7F3FCF" strokeWidth={2.5} dot={{ r: 3.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Most Popular Categories" subtitle="By borrow count">
            {charts.popularCategories.length === 0 ? (
              <EmptyState title="No borrows yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.popularCategories} dataKey="count" nameKey="category" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {charts.popularCategories.map((entry, i) => (
                      <Cell key={entry.category} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Most Borrowed Books" subtitle="All time">
            {charts.mostBorrowedBooks.length === 0 ? (
              <EmptyState title="No borrows yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.mostBorrowedBooks} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,26,46,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={120}
                    tick={{ fontSize: 11.5 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v.length > 16 ? `${v.slice(0, 16)}…` : v)}
                  />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#255FB0" radius={[0, 6, 6, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
