import { Link } from 'react-router-dom';
import { BookMarked, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-ink/[0.06] bg-ink text-white/70">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <BookMarked className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-semibold text-white">LibraFlow</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            A digital library built for a modern campus — discover, borrow and manage books without the paperwork.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/books" className="hover:text-white">Browse books</Link></li>
            <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link to="/about" className="hover:text-white">About LibraFlow</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40">Account</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/login" className="hover:text-white">Student login</Link></li>
            <li><Link to="/register" className="hover:text-white">Create account</Link></li>
            <li><Link to="/login" className="hover:text-white">Admin login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40">Visit the desk</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Central Library, Main Campus</li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> +91 522 000 1234</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" /> library@libraflow.edu</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} LibraFlow. Built for academic use.</p>
        <p>Designed &amp; developed as a B.Tech CSE final year project.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
