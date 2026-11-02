import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Users, ArrowUpRight, Power } from 'lucide-react';
import { userService } from '../../services';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { initialsFor, formatDate } from '../../utils/visual';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [toggleTarget, setToggleTarget] = useState(null);
  const [toggling, setToggling] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    userService
      .students({ search, status })
      .then((d) => setStudents(d.students))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, status]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { student } = await userService.toggleStudentStatus(toggleTarget._id, !toggleTarget.isActive);
      setStudents((prev) => prev.map((s) => (s._id === student._id ? student : s)));
      toast.success(`Student ${student.isActive ? 'activated' : 'deactivated'} successfully`);
      setToggleTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">Manage Students</h2>
      <p className="mt-1 text-sm text-ink/50">{students.length} registered students.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1 shadow-soft sm:max-w-sm">
          <Search className="h-4 w-4 text-ink/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or student ID..."
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/35"
          />
        </div>
        <select className="select sm:w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader label="Loading students..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : students.length === 0 ? (
          <EmptyState icon={Users} title="No students found" description="Try a different search or filter." />
        ) : (
          <div className="table-shell overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-plum-500 text-xs font-semibold text-white">
                          {initialsFor(s.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-ink line-clamp-1">{s.name}</p>
                          <p className="text-xs text-ink/45 line-clamp-1">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-ink/60">{s.studentId}</td>
                    <td className="text-ink/60">{formatDate(s.createdAt)}</td>
                    <td>
                      <span className={`badge ${s.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-ink/8 text-ink/50'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.isActive ? 'bg-emerald-500' : 'bg-ink/30'}`} />
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <Link to={`/admin/students/${s._id}`} className="rounded-lg p-2 text-ink/45 hover:bg-ink/5 hover:text-indigo-600" aria-label="View details">
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setToggleTarget(s)}
                          className={`rounded-lg p-2 ${s.isActive ? 'text-ink/45 hover:bg-rose-50 hover:text-rose-600' : 'text-ink/45 hover:bg-emerald-50 hover:text-emerald-600'}`}
                          aria-label="Toggle status"
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toggleTarget}
        title={`${toggleTarget?.isActive ? 'Deactivate' : 'Activate'} ${toggleTarget?.name}?`}
        description={
          toggleTarget?.isActive
            ? 'This student will no longer be able to log in or borrow books.'
            : 'This student will regain access to their account.'
        }
        confirmLabel={toggleTarget?.isActive ? 'Deactivate' : 'Activate'}
        danger={!!toggleTarget?.isActive}
        onConfirm={handleToggle}
        onClose={() => setToggleTarget(null)}
        loading={toggling}
      />
    </div>
  );
};

export default ManageStudents;
