import { Link } from 'react-router-dom';
import { Library, Users, Clock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const VALUES = [
  { icon: Clock, title: 'Fast & simple', text: 'Find and borrow a book in a few clicks — no queues, no paper slips.' },
  { icon: ShieldCheck, title: 'Trustworthy', text: 'Accurate, real-time availability and transparent fine tracking.' },
  { icon: Sparkles, title: 'Personal', text: 'Recommendations shaped by what you read and wishlist.' },
];

const About = () => (
  <div>
    <section className="border-b border-ink/[0.06] paper-bg">
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="eyebrow">About the project</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          A library built for how students actually read
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-ink/55">
          LibraFlow is a full-stack digital library management system designed to replace manual
          registers with a fast, searchable, always-available catalog — for students and librarians alike.
        </p>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Our mission</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Making the campus library effortless to use
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            Traditional library systems rely on physical registers, manual fine calculations, and long
            queues at the circulation desk. LibraFlow digitizes the entire workflow — from searching the
            catalog to issuing, returning and tracking fines — so students spend less time on process and
            more time reading.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            Built as a full MERN stack application, LibraFlow gives librarians a real-time dashboard of
            circulation activity while giving students a self-service portal for borrowing, wishlisting
            and requesting titles.
          </p>
          <Link to="/books" className="btn-accent mt-6 inline-flex">
            Browse the catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Library, label: 'Digital catalog' },
            { icon: Users, label: 'Student & admin roles' },
          ].map((f) => (
            <div key={f.label} className="card flex flex-col items-start gap-3 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="font-display text-sm font-semibold text-ink">{f.label}</p>
            </div>
          ))}
          <div className="stamp-card col-span-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Est.</p>
              <p className="font-display text-lg font-semibold text-ink">LibraFlow Library System</p>
            </div>
            <Library className="h-8 w-8 text-plum-500" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-ink/[0.06] bg-white/60 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-center">What we care about</p>
        <h2 className="mt-1 text-center font-display text-2xl font-semibold text-ink sm:text-3xl">Our values</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-6 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-plum-50 text-plum-600">
                <v.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="mt-4 font-display text-base font-semibold text-ink">{v.title}</p>
              <p className="mt-1.5 text-sm text-ink/55">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
