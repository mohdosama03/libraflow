import { Link } from 'react-router-dom';
import { BookX, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
      <BookX className="h-7 w-7" strokeWidth={1.75} />
    </span>
    <p className="mt-6 font-display text-6xl font-semibold text-ink">404</p>
    <h1 className="mt-2 font-display text-xl font-semibold text-ink">This page isn&apos;t on the shelf</h1>
    <p className="mt-2 max-w-sm text-sm text-ink/50">
      The page you&apos;re looking for may have been moved, renamed, or never existed.
    </p>
    <Link to="/" className="btn-primary mt-6">
      <ArrowLeft className="h-4 w-4" /> Back to home
    </Link>
  </div>
);

export default NotFound;
