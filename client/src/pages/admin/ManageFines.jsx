import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Receipt, Check, Ban } from 'lucide-react';
import { fineService } from '../../services';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatCard from '../../components/StatCard.jsx';
import { formatDate, currency, initialsFor } from '../../utils/visual';

const TABS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'waived', label: 'Waived' },
  { value: '', label: 'All' },
];

const ManageFines = () => {
  const [fines, setFines] = useState([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('pending');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fineService
      .list(tab ? { status: tab } : {})
      .then((d) => {
        setFines(d.fines);
        setTotalOutstanding(d.totalOutstanding);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await fineService.updateStatus(id, status);
      toast.success(`Fine marked as ${status}.`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Fines</h2>
      <p className="mt-1 text-sm text-ink/50">Track and settle late-return fines.</p>

      <div className="mt-5 max-w-xs">
        <StatCard icon={Receipt} label="Total Outstanding" value={currency(totalOutstanding)} tone="rose" />
      </div>

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
          <Loader label="Loading fines..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : fines.length === 0 ? (
          <EmptyState icon={Receipt} title="No fines here" description="Fines matching this filter will appear here." />
        ) : (
          <div className="table-shell overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Late Days</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
                          {initialsFor(f.user?.name)}
                        </div>
                        <div>
                          <p className="text-sm text-ink">{f.user?.name}</p>
                          <p className="text-xs text-ink/40">{f.user?.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-ink/60 line-clamp-1">{f.book?.title}</td>
                    <td className="text-ink/60">{f.lateDays} day(s)</td>
                    <td className="font-semibold text-ink">{currency(f.amount)}</td>
                    <td>
                      <StatusBadge status={f.status} />
                    </td>
                    <td>
                      {f.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStatus(f._id, 'paid')} disabled={busyId === f._id} className="btn-primary btn-sm bg-emerald-600 hover:bg-emerald-700">
                            <Check className="h-3.5 w-3.5" /> Paid
                          </button>
                          <button onClick={() => updateStatus(f._id, 'waived')} disabled={busyId === f._id} className="btn-outline btn-sm">
                            <Ban className="h-3.5 w-3.5" /> Waive
                          </button>
                        </div>
                      ) : (
                        <p className="text-right text-xs text-ink/35">{f.paidAt ? formatDate(f.paidAt) : '—'}</p>
                      )}
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

export default ManageFines;
