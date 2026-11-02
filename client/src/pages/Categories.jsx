import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowUpRight,
  Code2,
  Cpu,
  FlaskConical,
  Sigma,
  Landmark,
  Rocket,
  Sparkles,
  Search,
  UserRound,
  Briefcase,
  Coins,
  Brain,
  ScrollText,
  Zap,
  Palette,
  HeartPulse,
  Feather,
  Layers,
  Trees,
} from 'lucide-react';
import { categoryService } from '../services';
import Loader from '../components/Loader.jsx';
import ErrorState from '../components/ErrorState.jsx';

const ICON_MAP = {
  Code2,
  Cpu,
  FlaskConical,
  Sigma,
  Landmark,
  BookOpen,
  Rocket,
  Sparkles,
  Search,
  UserRound,
  Briefcase,
  Coins,
  Brain,
  ScrollText,
  Zap,
  Palette,
  HeartPulse,
  Feather,
  Layers,
  Trees,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="eyebrow">Browse the collection</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Categories</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/55">
        Explore our comprehensive catalog across 20 distinct academic and literary disciplines.
      </p>

      <div className="mt-10">
        {loading ? (
          <Loader label="Loading categories..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const IconComp = ICON_MAP[c.icon] || BookOpen;
              return (
                <Link
                  key={c._id}
                  to={`/books?category=${c._id}`}
                  className="card group flex items-start gap-4 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lift"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-plum-600 text-white shadow-soft transition group-hover:scale-105">
                    <IconComp className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-base font-semibold text-ink group-hover:text-indigo-600 transition">
                        {c.name}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-ink/25 transition group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="mt-1 text-xs text-ink/50 line-clamp-2 leading-relaxed">{c.description}</p>
                    <p className="mt-3 text-xs font-semibold text-indigo-600">{c.bookCount} titles</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
