import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, X, Library } from 'lucide-react';
import { bookService, categoryService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Pagination from '../../components/Pagination.jsx';

const emptyForm = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publisher: '',
  publicationYear: '',
  description: '',
  totalCopies: 1,
  shelfNumber: '',
};

const BookFormModal = ({ open, onClose, onSubmit, categories, initial, saving }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title,
              author: initial.author,
              isbn: initial.isbn,
              category: initial.category?._id || initial.category,
              publisher: initial.publisher || '',
              publicationYear: initial.publicationYear || '',
              description: initial.description || '',
              totalCopies: initial.totalCopies,
              shelfNumber: initial.shelfNumber || '',
            }
          : emptyForm
      );
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.isbn || !form.category || !form.totalCopies) {
      toast.error('Please fill in all required fields.');
      return;
    }
    onSubmit({ ...form, totalCopies: Number(form.totalCopies), publicationYear: form.publicationYear ? Number(form.publicationYear) : undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-lift scrollbar-thin">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">{initial ? 'Edit Book' : 'Add New Book'}</h3>
          <button onClick={onClose} className="text-ink/30 hover:text-ink/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="label">Book title *</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Author *</label>
              <input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </div>
            <div>
              <label className="label">ISBN *</label>
              <input className="input" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Publisher</label>
              <input className="input" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Pub. year</label>
              <input type="number" className="input" value={form.publicationYear} onChange={(e) => setForm({ ...form, publicationYear: e.target.value })} />
            </div>
            <div>
              <label className="label">Total copies *</label>
              <input type="number" min="0" className="input" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: e.target.value })} required />
            </div>
            <div>
              <label className="label">Shelf no.</label>
              <input className="input" value={form.shelfNumber} onChange={(e) => setForm({ ...form, shelfNumber: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[90px] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary btn-sm">
              {saving ? 'Saving...' : initial ? 'Save changes' : 'Add book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    bookService
      .list({ search, page, limit: 10, sort: '-createdAt' })
      .then((d) => {
        setBooks(d.books);
        setPagination({ page: d.page, pages: d.pages, total: d.total });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);
  useEffect(() => {
    categoryService.list().then((d) => setCategories(d.categories)).catch(() => {});
  }, []);

  const openAdd = () => {
    setEditingBook(null);
    setModalOpen(true);
  };
  const openEdit = (book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingBook) {
        await bookService.update(editingBook._id, payload);
        toast.success('Book updated successfully');
      } else {
        await bookService.create(payload);
        toast.success('Book added successfully');
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
      await bookService.remove(deleteTarget._id);
      toast.success('Book deleted successfully');
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
          <h2 className="font-display text-xl font-semibold text-ink">Manage Books</h2>
          <p className="mt-1 text-sm text-ink/50">{pagination.total} titles in the catalog.</p>
        </div>
        <button onClick={openAdd} className="btn-accent">
          <Plus className="h-4 w-4" /> Add Book
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1 shadow-soft sm:max-w-sm">
        <Search className="h-4 w-4 text-ink/35" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search books..."
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/35"
        />
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader label="Loading books..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : books.length === 0 ? (
          <EmptyState icon={Library} title="No books found" description="Add your first book to get started." action={<button onClick={openAdd} className="btn-accent btn-sm">Add Book</button>} />
        ) : (
          <>
            <div className="table-shell overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Category</th>
                    <th>ISBN</th>
                    <th>Copies</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <BookCover title={book.title} author={book.author} className="h-12 w-9 shrink-0 p-1.5" size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-ink line-clamp-1">{book.title}</p>
                            <p className="text-xs text-ink/45 line-clamp-1">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-ink/60">{book.category?.name}</td>
                      <td className="text-ink/50">{book.isbn}</td>
                      <td className="text-ink/60">{book.availableCopies}/{book.totalCopies}</td>
                      <td>
                        <span className={`badge ${book.availableCopies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${book.availableCopies > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => openEdit(book)} className="rounded-lg p-2 text-ink/45 hover:bg-ink/5 hover:text-indigo-600" aria-label="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(book)} className="rounded-lg p-2 text-ink/45 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
          </>
        )}
      </div>

      <BookFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        initial={editingBook}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This action cannot be undone. Books with active borrowings cannot be deleted."
        confirmLabel="Delete book"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default ManageBooks;
