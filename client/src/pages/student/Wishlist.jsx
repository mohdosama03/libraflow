import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Heart, ArrowUpRight, X } from 'lucide-react';
import { wishlistService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    wishlistService
      .list()
      .then((d) => setItems(d.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (bookId) => {
    setBusyId(bookId);
    try {
      await wishlistService.remove(bookId);
      setItems((prev) => prev.filter((i) => i.book._id !== bookId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-ink">My Wishlist</h2>
      <p className="mt-1 text-sm text-ink/50">Books you&apos;re saving for later.</p>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading your wishlist..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Tap the heart icon on any book to save it here for later."
            action={
              <Link to="/books" className="btn-accent btn-sm">
                Discover Books
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(({ book }) => {
              const available = book.availableCopies > 0;
              return (
                <div key={book._id} className="card flex gap-4 p-4">
                  <BookCover title={book.title} author={book.author} className="h-28 w-20 shrink-0 p-2" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm font-semibold leading-snug text-ink line-clamp-2">{book.title}</p>
                      <button
                        onClick={() => remove(book._id)}
                        disabled={busyId === book._id}
                        className="shrink-0 text-ink/25 hover:text-rose-500"
                        aria-label="Remove from wishlist"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-ink/45">{book.author}</p>
                    <span className={`badge mt-2 w-fit ${available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {available ? 'Available' : 'Unavailable'}
                    </span>
                    <Link to={`/books/${book._id}`} className="btn-outline btn-sm mt-3 w-fit">
                      View Book <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
