import { useState } from 'react';
import { paletteFor, initialsFor } from '../utils/visual';

// Backup title-to-ISBN dictionary for instant cover resolution across all pages
const TITLE_ISBN_MAP = {
  'Clean Code: A Handbook of Agile Software Craftsmanship': '9780132350884',
  'Clean Code': '9780132350884',
  'The Pragmatic Programmer: Your Journey to Mastery': '9780135957059',
  'The Pragmatic Programmer': '9780201616224',
  'Introduction to Algorithms (CLRS)': '9780262046305',
  'Introduction to Algorithms': '9780262033848',
  'Designing Data-Intensive Applications': '9781449373320',
  'Design Patterns: Elements of Reusable Object-Oriented Software': '9780201633610',
  'Design Patterns': '9780201633610',
  'Deep Learning': '9780262035613',
  'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow': '9781098125974',
  'Artificial Intelligence: A Modern Approach': '9780134610993',
  'Life 3.0: Being Human in the Age of Artificial Intelligence': '9781101946596',
  'A Brief History of Time': '9780553380163',
  'Cosmos': '9780345539434',
  'Astrophysics for People in a Hurry': '9780393609394',
  'Six Easy Pieces: Essentials of Physics Explained by Its Most Brilliant Teacher': '9780465025275',
  'The Selfish Gene': '9780198788607',
  'Gödel, Escher, Bach: An Eternal Golden Braid': '9780465026562',
  'How Not to Be Wrong: The Power of Mathematical Thinking': '9780143127536',
  'The Joy of x: A Guided Tour of Math, from One to Infinity': '9780544241695',
  'Linear Algebra Done Right': '9783031410253',
  'Sapiens: A Brief History of Humankind': '9780062316097',
  'Sapiens': '9780062316097',
  'Guns, Germs, and Steel: The Fates of Human Societies': '9780393317558',
  'Guns, Germs, and Steel': '9780393317558',
  'The Silk Roads: A New History of the World': '9781101912379',
  'SPQR: A History of Ancient Rome': '9781631492228',
  '1984': '9780451524935',
  'To Kill a Mockingbird': '9780061120084',
  'The Great Gatsby': '9780743273565',
  'Pride and Prejudice': '9780141439518',
  'Crime and Punishment': '9780140449136',
  'Dune': '9780441172719',
  'Neuromancer': '9780441569595',
  'The Three-Body Problem': '9780765382030',
  'Foundation': '9780553293357',
  'Snow Crash': '9780553380958',
  'The Hobbit': '9780547928227',
  'The Fellowship of the Ring': '9780547928210',
  'The Name of the Wind': '9780756404741',
  'Mistborn: The Final Empire': '9780765350381',
  'A Game of Thrones': '9780553593716',
  'And Then There Were None': '9780062073488',
  'The Hound of the Baskervilles': '9780141034331',
  'The Girl with the Dragon Tattoo': '9780307949486',
  'Gone Girl': '9780307588371',
  'Steve Jobs': '9781451648539',
  'Educated: A Memoir': '9780399590504',
  'Educated': '9780399590504',
  'Shoe Dog: A Memoir by the Creator of Nike': '9781501135910',
  'The Diary of a Young Girl': '9780553296983',
  'Zero to One: Notes on Startups, or How to Build the Future': '9780804139298',
  'Zero to One': '9780804139298',
  'The Lean Startup': '9780307887894',
  'Good to Great: Why Some Companies Make the Leap... and Others Don’t': '9780066620992',
  'Good to Great': '9780066620992',
  'The Hard Thing About Hard Things': '9780062273208',
  'The Psychology of Money': '9780857197689',
  'Thinking, Fast and Slow': '9780374533557',
  'Freakonomics: A Rogue Economist Explores the Hidden Side of Everything': '9780060731335',
  'The Intelligent Investor': '9780060555665',
  'Man’s Search for Meaning': '9780807014295',
  'Influence: The Psychology of Persuasion': '9780061241895',
  'Quiet: The Power of Introverts in a World That Can’t Stop Talking': '9780307352156',
  'The Power of Habit: Why We Do What We Do in Life and Business': '9780812981605',
  'Meditations': '9780812968255',
  'Justice: What’s the Right Thing to Do?': '9780374532505',
  'The Republic': '9780140455113',
  'Beyond Good and Evil': '9780140449235',
  'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones': '9780735211292',
  'Atomic Habits': '9780735211292',
  'Deep Work: Rules for Focused Success in a Distracted World': '9781455586691',
  'Deep Work': '9781455586691',
  'The 7 Habits of Highly Effective People': '9781982137274',
  'Essentialism: The Disciplined Pursuit of Less': '9780804137386',
  'The Design of Everyday Things': '9780465050659',
  'Don’t Make Me Think, Revisited: A Common Sense Approach to Web Usability': '9780321965516',
  'Thinking with Type: A Critical Guide for Designers, Writers, Editors, & Students': '9781648962080',
  'The Architecture of Happiness': '9780307277244',
  'The Emperor of All Maladies: A Biography of Cancer': '9781439170915',
  'When Breath Becomes Air': '9780812988406',
  'Why We Sleep: Unlocking the Power of Sleep and Dreams': '9781501144325',
  'Being Mortal: Medicine and What Matters in the End': '9781250081247',
  'Hamlet': '9780743477123',
  'The Odyssey': '9780393356250',
  'Leaves of Grass': '9780140421996',
  'Selected Poems of Pablo Neruda': '9780547549422',
  'Watchmen': '9781779501127',
  'Maus: A Survivor’s Tale': '9780679406419',
  'The Sandman: Preludes & Nocturnes': '9781401284770',
  'Persepolis: The Story of a Childhood': '9780375714573',
  'Silent Spring': '9780618249060',
  'The Sixth Extinction: An Unnatural History': '9781250062185',
  'Braiding Sweetgrass: Indigenous Wisdom, Scientific Knowledge and the Teachings of Plants': '9781571313560',
  'The Hidden Life of Trees: What They Feel, How They Communicate': '9781771642484',
};

const BookCover = ({
  coverImage,
  isbn,
  title = '',
  author = '',
  className = '',
  size = 'md',
  book,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Extract props if a book object was passed
  const effectiveTitle = book?.title || title || 'Book';
  const effectiveAuthor = book?.author || author || '';
  const effectiveIsbn = book?.isbn || isbn || TITLE_ISBN_MAP[effectiveTitle] || TITLE_ISBN_MAP[effectiveTitle.split(':')[0].trim()];
  const effectiveCover = book?.coverImage || coverImage || (effectiveIsbn ? `https://covers.openlibrary.org/b/isbn/${effectiveIsbn}-L.jpg` : null);

  const [from, to] = paletteFor(effectiveTitle || effectiveAuthor || 'book');
  const sizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-base',
  };

  const hasImage = Boolean(effectiveCover && !imageError);

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl bg-ink/5 shadow-soft transition-all duration-300 ${className}`}
    >
      {/* Real Book Cover Image */}
      {hasImage && (
        <div className="absolute inset-0 h-full w-full bg-slate-900">
          <img
            src={effectiveCover}
            alt={effectiveTitle}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
          {/* Authentic Book Spine Shadow on the left edge */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/45 via-black/15 to-transparent z-10" />
          {/* Subtle glossy sheen over the right side */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 mix-blend-overlay z-10" />
        </div>
      )}

      {/* Styled Gradient Fallback (visible while loading or if image is unavailable) */}
      {(!hasImage || !imageLoaded) && (
        <div
          className="relative flex h-full w-full flex-col justify-between overflow-hidden p-3 text-white transition-opacity duration-300"
          style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
        >
          {/* 3D Spine & Radial ambient highlights */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-black/20" />
          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />

          <span
            className={`relative font-display font-semibold uppercase tracking-wider opacity-75 ${sizes[size]}`}
          >
            {initialsFor(effectiveTitle)}
          </span>

          <div className="relative z-10">
            <p className="font-display text-sm font-semibold leading-snug line-clamp-3">
              {effectiveTitle}
            </p>
            {effectiveAuthor && (
              <p className="mt-1 text-[11px] text-white/75 line-clamp-1">
                {effectiveAuthor}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCover;
