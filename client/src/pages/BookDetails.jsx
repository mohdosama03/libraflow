import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Star,
  Heart,
  ArrowLeft,
  Hash,
  Building2,
  CalendarDays,
  MapPin,
  Layers,
  ClipboardList,
  QrCode,
} from 'lucide-react';
import { bookService, wishlistService, requestService } from '../services';
import BookCover from '../components/BookCover.jsx';
import Loader from '../components/Loader.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { initialsFor } from '../utils/visual';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError(null);
    bookService
      .get(id)
      .then((d) => {
        setBook(d.book);
        setReviews(d.reviews);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    if (user?.role === 'student') {
      wishlistService
        .list()
        .then((d) => setWishlisted(d.items.some((i) => i.book._id === id)))
        .catch(() => {});
    }
  };

  useEffect(load, [id, user]);

  const requireLogin = () => {
    toast('Please log in to continue.', { icon: '🔐' });
    navigate('/login', { state: { from: { pathname: `/books/${id}` } } });
  };

  const handleRequest = async () => {
    if (!user) return requireLogin();
    if (user.role !== 'student') return toast.error('Only students can request books.');
    setBusy(true);
    try {
      await requestService.create({ bookId: id });
      toast.success('Book request submitted successfully.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) return requireLogin();
    if (user.role !== 'student') return toast.error('Only students can use the wishlist.');
    setBusy(true);
    try {
      if (wishlisted) {
        await wishlistService.remove(id);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.add(id);
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader fullScreen label="Fetching book details..." />;
  if (error || !book) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorState message={error || 'Book not found'} onRetry={load} /></div>;

  const available = book.availableCopies > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="btn-ghost btn-sm mb-6 -ml-3">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
        <div>
          <BookCover
            coverImage={book.coverImage}
            isbn={book.isbn}
            title={book.title}
            author={book.author}
            size="lg"
            className="h-[420px] w-full shadow-card"
          />
          <div className="mt-4 flex gap-2">
            <button onClick={handleWishlist} disabled={busy} className={`btn flex-1 ${wishlisted ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'btn-outline'}`}>
              <Heart className="h-4 w-4" fill={wishlisted ? 'currentColor' : 'none'} />
              {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button onClick={() => setShowQr((s) => !s)} className="btn-outline" aria-label="Show QR code">
              <QrCode className="h-4 w-4" />
            </button>
          </div>
          {showQr && book.qrCode && (
            <div className="stamp-card mt-4 flex flex-col items-center gap-2 text-center">
              <img src={book.qrCode} alt={`QR code for ${book.title}`} className="h-32 w-32" />
              <p className="text-xs text-ink/50">Scan at the circulation desk for quick lookup</p>
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow">{book.category?.name}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">{book.title}</h1>
          <p className="mt-2 text-base text-ink/55">by {book.author}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              <span className="text-sm font-semibold text-ink/70">{book.rating ? book.rating.toFixed(1) : 'No ratings yet'}</span>
              {book.ratingCount > 0 && <span className="text-sm text-ink/40">({book.ratingCount} reviews)</span>}
            </div>
            <span className={`badge ${available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {available ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/65">
            {book.description || 'No description has been added for this title yet.'}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { icon: Hash, label: 'ISBN', value: book.isbn },
              { icon: Building2, label: 'Publisher', value: book.publisher || '—' },
              { icon: CalendarDays, label: 'Published', value: book.publicationYear || '—' },
              { icon: MapPin, label: 'Shelf Number', value: book.shelfNumber },
              { icon: Layers, label: 'Total Copies', value: book.totalCopies },
              { icon: ClipboardList, label: 'Available Copies', value: book.availableCopies },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-ink/[0.06] bg-white p-3.5">
                <item.icon className="h-4 w-4 text-indigo-500" strokeWidth={1.75} />
                <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-ink/40">{item.label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-ink">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={handleRequest} disabled={busy} className="btn-accent">
              Request Book
            </button>
            <Link to="/dashboard" className="btn-outline">
              View in Dashboard
            </Link>
          </div>
          <p className="mt-3 text-xs text-ink/40">
            Book requests are reviewed by the library desk, which will notify you once approved and ready for collection.
          </p>

          {/* REVIEWS */}
          {reviews.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-lg font-semibold text-ink">Reader Reviews</h2>
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {initialsFor(r.user?.name || 'U')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{r.user?.name}</p>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3" fill={i < r.rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.comment && <p className="mt-3 text-sm text-ink/60">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
