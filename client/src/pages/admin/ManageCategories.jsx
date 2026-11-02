import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Shapes } from 'lucide-react';
import { categoryService } from '../../services';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

const CategoryModal = ({ open, onClose, onSubmit, initial, saving }) => {
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    if (open) setForm(initial ? { name: initial.name, description: initial.description || '' } : { name: '', description: '' });
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">{initial ? 'Edit Category' : 'Add Category'}</h3>
          <button onClick={onClose} className="text-ink/30 hover:text-ink/60">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) return toast.error('Category name is required.');
            onSubmit(form);
          }}
          className="mt-5 space-y-4"
        >
          <div>
            <label className="label">Name *</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[80px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary btn-sm">
              {saving ? 'Saving...' : initial ? 'Save changes' : 'Add category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    categoryService
      .list()
      .then((d) => setCategories(d.categories))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await categoryService.update(editing._id, payload);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(payload);
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await categoryService.remove(deleteTarget._id);
      toast.success('Category deleted successfully');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Manage Categories</h2>
          <p className="mt-1 text-sm text-ink/50">Organize the catalog into browsable subjects.</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-accent">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading categories..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : categories.length === 0 ? (
          <EmptyState icon={Shapes} title="No categories yet" description="Create categories to organize your book catalog." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div key={c._id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-base font-semibold text-ink">{c.name}</p>
                    <p className="mt-1 text-xs text-ink/50 line-clamp-2">{c.description}</p>
                  </div>
                  <span className="badge shrink-0 bg-indigo-50 text-indigo-700">{c.bookCount} books</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { setEditing(c); setModalOpen(true); }} className="btn-outline btn-sm flex-1">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(c)} className="btn-outline btn-sm text-rose-600 hover:border-rose-200 hover:bg-rose-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CategoryModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initial={editing} saving={saving} />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="Categories that still have books assigned cannot be deleted."
        confirmLabel="Delete category"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default ManageCategories;
