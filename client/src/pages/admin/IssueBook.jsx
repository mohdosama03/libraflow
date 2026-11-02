import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, User, BookOpen, CalendarDays, BookUp, Check } from 'lucide-react';
import { bookService, userService, borrowService } from '../../services';
import BookCover from '../../components/BookCover.jsx';
import { initialsFor } from '../../utils/visual';

const IssueBook = () => {
  const [studentQuery, setStudentQuery] = useState('');
  const [studentResults, setStudentResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearching, setStudentSearching] = useState(false);

  const [bookQuery, setBookQuery] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookSearching, setBookSearching] = useState(false);

  const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const [dueDate, setDueDate] = useState(defaultDue);
  const [issuing, setIssuing] = useState(false);
  const [lastIssued, setLastIssued] = useState(null);

  const searchStudents = async (q) => {
    setStudentQuery(q);
    setSelectedStudent(null);
    if (q.length < 2) return setStudentResults([]);
    setStudentSearching(true);
    try {
      const { students } = await userService.students({ search: q, status: 'active' });
      setStudentResults(students.slice(0, 6));
    } catch {
      /* silent */
    } finally {
      setStudentSearching(false);
    }
  };

  const searchBooks = async (q) => {
    setBookQuery(q);
    setSelectedBook(null);
    if (q.length < 2) return setBookResults([]);
    setBookSearching(true);
    try {
      const { books } = await bookService.list({ search: q, availability: 'available', limit: 6 });
      setBookResults(books);
    } catch {
      /* silent */
    } finally {
      setBookSearching(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedBook) {
      toast.error('Please select both a student and a book.');
      return;
    }
    setIssuing(true);
    try {
      const { borrowing } = await borrowService.issue({
        userId: selectedStudent._id,
        bookId: selectedBook._id,
        dueDate,
      });
      toast.success('Book issued successfully.');
      setLastIssued(borrowing);
      setSelectedStudent(null);
      setSelectedBook(null);
      setStudentQuery('');
      setBookQuery('');
      setStudentResults([]);
      setBookResults([]);
      setDueDate(defaultDue);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-xl font-semibold text-ink">Issue Book</h2>
      <p className="mt-1 text-sm text-ink/50">Check out a book to a registered student.</p>

      <form onSubmit={handleIssue} className="card mt-6 space-y-6 p-6">
        {/* STUDENT */}
        <div>
          <label className="label">Select student</label>
          {selectedStudent ? (
            <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-plum-500 text-xs font-semibold text-white">
                  {initialsFor(selectedStudent.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{selectedStudent.name}</p>
                  <p className="text-xs text-ink/50">{selectedStudent.studentId} · {selectedStudent.email}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedStudent(null)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input
                className="input pl-10"
                placeholder="Search by name, email or student ID..."
                value={studentQuery}
                onChange={(e) => searchStudents(e.target.value)}
              />
              {studentQuery.length >= 2 && (
                <div className="mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-ink/10 bg-white shadow-card scrollbar-thin">
                  {studentSearching ? (
                    <p className="p-3 text-sm text-ink/40">Searching...</p>
                  ) : studentResults.length === 0 ? (
                    <p className="p-3 text-sm text-ink/40">No active students found.</p>
                  ) : (
                    studentResults.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => { setSelectedStudent(s); setStudentQuery(''); setStudentResults([]); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-indigo-50/60"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                          {initialsFor(s.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                          <p className="truncate text-xs text-ink/45">{s.studentId} · {s.email}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOOK */}
        <div>
          <label className="label">Select book</label>
          {selectedBook ? (
            <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <BookCover title={selectedBook.title} author={selectedBook.author} className="h-12 w-9 shrink-0 p-1.5" size="sm" />
                <div>
                  <p className="text-sm font-semibold text-ink line-clamp-1">{selectedBook.title}</p>
                  <p className="text-xs text-ink/50">{selectedBook.availableCopies} copies available</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedBook(null)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input
                className="input pl-10"
                placeholder="Search by title, author or ISBN..."
                value={bookQuery}
                onChange={(e) => searchBooks(e.target.value)}
              />
              {bookQuery.length >= 2 && (
                <div className="mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-ink/10 bg-white shadow-card scrollbar-thin">
                  {bookSearching ? (
                    <p className="p-3 text-sm text-ink/40">Searching...</p>
                  ) : bookResults.length === 0 ? (
                    <p className="p-3 text-sm text-ink/40">No available books found.</p>
                  ) : (
                    bookResults.map((b) => (
                      <button
                        key={b._id}
                        type="button"
                        onClick={() => { setSelectedBook(b); setBookQuery(''); setBookResults([]); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-indigo-50/60"
                      >
                        <BookCover title={b.title} author={b.author} className="h-10 w-8 shrink-0 p-1" size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{b.title}</p>
                          <p className="truncate text-xs text-ink/45">{b.author} · {b.availableCopies} available</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="label">Due date</label>
          <div className="relative max-w-xs">
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input type="date" className="input pl-10" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>
        </div>

        <button type="submit" disabled={issuing} className="btn-accent">
          <BookUp className="h-4 w-4" /> {issuing ? 'Issuing...' : 'Issue Book'}
        </button>
      </form>

      {lastIssued && (
        <div className="stamp-card mt-6 flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Check className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="text-sm">
            <p className="font-display font-semibold text-ink">Book issued successfully</p>
            <p className="mt-0.5 text-ink/55">
              &ldquo;{lastIssued.book.title}&rdquo; issued to {lastIssued.user.name} ({lastIssued.user.studentId}), due{' '}
              {new Date(lastIssued.dueDate).toDateString()}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueBook;
