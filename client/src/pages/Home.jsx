import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Library,
  UserPlus,
  BookCheck,
  Bell,
} from 'lucide-react';
import { bookService, categoryService, dashboardService, wishlistService } from '../services';
import BookCard from '../components/BookCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const HOW_IT_WORKS = [
  { icon: UserPlus, title: 'Create your account', text: 'Register with your student email in under a minute.' },
  { icon: Search, title: 'Find your next read', text: 'Search the catalog by title, author, ISBN or category.' },
  { icon: BookCheck, title: 'Borrow or request', text: 'Reserve available copies or request titles that are out.' },
  { icon: Bell, title: 'Track & renew', text: 'Get reminders before due dates and manage returns with ease.' },
];

const WHY_LIBRAFLOW = [
  { icon: Clock, title: 'Save time', text: 'Skip the queue — search, reserve and track loans from any device.' },
  { icon: ShieldCheck, title: 'Always accurate', text: 'Real-time availability means no more wasted trips to an empty shelf.' },
  { icon: Sparkles, title: 'Made for you', text: 'Recommendations based on what you\u2019ve read, wishlisted and loved.' },
];

const Home = () => {
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    Promise.all([
      dashboardService.publicStats(),
      bookService.popular(),
      bookService.recent(),
      categoryService.list(),
    ])
      .then(([statsRes, popularRes, recentRes, categoryRes]) => {
        if (!mounted) return;
        setStats(statsRes.stats);
        setPopular(popularRes.books);
        setRecent(recentRes.books);
        setCategories(categoryRes.categories.slice(0, 12));
      })
      .catch(() => toast.error('Could not load homepage content.'))
      .finally(() => mounted && setLoading(false));

    if (user?.role === 'student') {
      wishlistService.list().then((d) => setWishlistIds(new Set(d.items.map((i) => i.book._id)))).catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  const toggleWishlist = async (book) => {
    if (!user) return navigate('/login');
    if (user.role !== 'student') return;
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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/books?search=${encodeURIComponent(query)}` : '/books');
  };

  const statItems = [
    { label: 'Total Books', value: stats?.totalBooks ?? '—', icon: Library },
    { label: 'Available Books', value: stats?.availableBooks ?? '—', icon: BookOpen },
    { label: 'Registered Members', value: stats?.registeredMembers ?? '—', icon: Users },
    { label: 'Books Issued', value: stats?.booksIssued ?? '—', icon: CheckCircle2 },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/[0.06] paper-bg">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-plum-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-plum-200 bg-white px-3.5 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Your campus library, digitized
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-6xl">
              Discover. <span className="text-indigo-600">Borrow.</span> Learn.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-ink/55 sm:text-lg">
              Your digital library for discovering, borrowing and managing books with ease.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-ink/10 bg-white p-1.5 shadow-card">
              <Search className="ml-3 h-4.5 w-4.5 shrink-0 text-ink/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books, authors or ISBN..."
                className="w-full bg-transparent px-1 py-2 text-sm outline-none placeholder:text-ink/35"
              />
              <button type="submit" className="btn-primary btn-sm shrink-0">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/books" className="btn-accent">
                Explore Books <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/register'} className="btn-outline">
                Get Started
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {statItems.map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <s.icon className="mx-auto h-5 w-5 text-indigo-500" strokeWidth={1.75} />
                <p className="mt-2 font-display text-2xl font-semibold text-ink">{s.value}</p>
                <p className="mt-0.5 text-xs text-ink/45">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR BOOKS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Reader favorites</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Popular Books</h2>
          </div>
          <Link to="/books" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : popular
                .slice(0, 4)
                .map((b) => (
                  <BookCard key={b._id} book={b} isWishlisted={wishlistIds.has(b._id)} onToggleWishlist={toggleWishlist} />
                ))}
        </div>
      </section>

      {/* RECENTLY ADDED */}
      <section className="border-y border-ink/[0.06] bg-white/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Fresh on the shelf</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">Recently Added Books</h2>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : recent
                  .slice(0, 4)
                  .map((b) => (
                    <BookCard key={b._id} book={b} isWishlisted={wishlistIds.has(b._id)} onToggleWishlist={toggleWishlist} />
                  ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow text-center">Browse by subject</p>
        <h2 className="mt-1 text-center font-display text-2xl font-semibold text-ink sm:text-3xl">Book Categories</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/books?category=${c._id}`}
              className="card group flex flex-col items-start p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lift"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <BookOpen className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <p className="mt-4 font-display text-base font-semibold text-ink">{c.name}</p>
              <p className="mt-0.5 text-xs text-ink/45">{c.bookCount} titles</p>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-ink/[0.06] bg-ink py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-center text-plum-300">Getting started</p>
          <h2 className="mt-1 text-center font-display text-2xl font-semibold text-white sm:text-3xl">How It Works</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 font-display text-base font-semibold text-white">{step.title}</p>
                <p className="mt-1.5 text-sm text-white/50">{step.text}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute right-[-1rem] top-5 hidden h-px w-8 bg-white/15 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="eyebrow text-center">The LibraFlow difference</p>
        <h2 className="mt-1 text-center font-display text-2xl font-semibold text-ink sm:text-3xl">Why Choose LibraFlow</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {WHY_LIBRAFLOW.map((item) => (
            <div key={item.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-plum-50 text-plum-600">
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-ink">{item.title}</p>
              <p className="mt-1.5 text-sm text-ink/55">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-plum-700 px-8 py-14 text-center sm:px-16">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Ready to start reading?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
            Join LibraFlow today and get instant access to the full catalog.
          </p>
          <Link to="/register" className="btn mt-6 inline-flex bg-white text-ink hover:bg-white/90">
            Create your free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
