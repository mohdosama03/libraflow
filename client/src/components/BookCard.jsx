import { Link } from 'react-router-dom';
import { Star, Heart, ArrowUpRight } from 'lucide-react';
import BookCover from './BookCover.jsx';

const BookCard = ({ book, isWishlisted, onToggleWishlist, wishlistBusy }) => {
  const available = book.availableCopies > 0;

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/books/${book._id}`} className="relative block h-48 shrink-0">
        <BookCover
          coverImage={book.coverImage}
          isbn={book.isbn}
          title={book.title}
          author={book.author}
          className="h-full w-full"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist?.(book);
          }}
          disabled={wishlistBusy}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition ${
            isWishlisted ? 'bg-white text-rose-500' : 'bg-white/25 text-white hover:bg-white/40'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>
        <span
          className={`absolute bottom-3 left-3 badge ${
            available ? 'bg-white/90 text-emerald-700' : 'bg-white/90 text-rose-600'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {available ? `${book.availableCopies} available` : 'Unavailable'}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow">{book.category?.name || 'General'}</p>
        <Link to={`/books/${book._id}`}>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink line-clamp-2 hover:text-indigo-600">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-ink/55 line-clamp-1">{book.author}</p>

        <div className="mt-3 flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
          <span className="text-xs font-semibold text-ink/70">
            {book.rating ? book.rating.toFixed(1) : 'New'}
          </span>
          {book.ratingCount > 0 && <span className="text-xs text-ink/40">({book.ratingCount})</span>}
        </div>

        <Link
          to={`/books/${book._id}`}
          className="btn-outline btn-sm mt-4 w-full justify-between group-hover:border-indigo-300 group-hover:text-indigo-600"
        >
          View details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
