import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  const items = [];
  const window = 1;
  for (let p = 1; p <= pages; p += 1) {
    if (p === 1 || p === pages || (p >= page - window && p <= page + window)) {
      items.push(p);
    } else if (items[items.length - 1] !== '...') {
      items.push('...');
    }
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn-ghost btn-sm h-9 w-9 rounded-full p-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {items.map((item, idx) =>
        item === '...' ? (
          <span key={`dots-${idx}`} className="px-1.5 text-sm text-ink/35">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
              item === page ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5'
            }`}
          >
            {item}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="btn-ghost btn-sm h-9 w-9 rounded-full p-0"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
