import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, BookX } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookService, categoryService, wishlistService } from '../services';
import BookCard from '../components/BookCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Pagination from '../components/Pagination.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'title', label: 'Title A–Z' },
  { value: '-rating', label: 'Top rated' },
  { value: '-availableCopies', label: 'Most available' },
];

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();
  const { user } = useAuth();

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      author: searchParams.get('author') || '',
      availability: searchParams.get('availability') || '',
      sort: searchParams.get('sort') || '-createdAt',
      page: Number(searchParams.get('page') || 1),
    }),
    [searchParams]
  );

  useEffect(() => {
    categoryService.list().then((d) => setCategories(d.categories)).catch(() => {});
    if (user?.role === 'student') {
      wishlistService.list().then((d) => setWishlistIds(new Set(d.items.map((i) => i.book._id)))).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    bookService
      .list({ ...filters, limit: 12 })
      .then((d) => {
        setBooks(d.books);
        setPagination({ page: d.page, pages: d.pages, total: d.total });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const toggleWishlist = async (book) => {
    if (!user) return navigate('/login');
    if (user.role !== 'student') return toast.error('Only students can use the wishlist.');
    try {
      if (wishlistIds.has(book._id)) {
        await wishlistService.remove(book._id);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(book._id);
          return next;
        });
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.add(book._id);
        setWishlistIds((prev) => new Set(prev).add(book._id));
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const activeFilterCount = ['category', 'author', 'availability'].filter((k) => filters[k]).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="eyebrow">The catalog</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Browse Books</h1>
        <p className="mt-1.5 text-sm text-ink/50">
          {loading ? 'Searching the shelves…' : `${pagination.total} title${pagination.total === 1 ? '' : 's'} found`}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1 shadow-soft">
          <Search className="h-4 w-4 shrink-0 text-ink/35" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, author or ISBN..."
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/35"
          />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); updateParam('search', ''); }} className="text-ink/30 hover:text-ink/60">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
        <button onClick={() => setFiltersOpen((o) => !o)} className="btn-outline shrink-0 sm:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* FILTER SIDEBAR */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="card sticky top-24 space-y-6 p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-ink">Filters</p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Clear all
                </button>
              )}
            </div>

            <div>
              <label className="label">Category</label>
              <select className="select" value={filters.category} onChange={(e) => updateParam('category', e.target.value)}>
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Author</label>
              <input
                className="input"
                placeholder="Filter by author"
                value={filters.author}
                onChange={(e) => updateParam('author', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Availability</label>
              <div className="space-y-2">
                {[
                  { value: '', label: 'All books' },
                  { value: 'available', label: 'Available only' },
                  { value: 'unavailable', label: 'Currently unavailable' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm text-ink/65">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === opt.value}
                      onChange={() => updateParam('availability', opt.value)}
                      className="h-3.5 w-3.5 accent-indigo-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Sort by</label>
              <select className="select" value={filters.sort} onChange={(e) => updateParam('sort', e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <div>
          {error ? (
            <ErrorState message={error} onRetry={() => setSearchParams(searchParams)} />
          ) : loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : books.length === 0 ? (
            <EmptyState
              icon={BookX}
              title="No books matched your search"
              description="Try a different keyword, or clear your filters to see the full catalog."
              action={
                <button onClick={clearFilters} className="btn-outline btn-sm">
                  Clear filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    isWishlisted={wishlistIds.has(book._id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
              <Pagination page={pagination.page} pages={pagination.pages} onChange={(p) => updateParam('page', p)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
