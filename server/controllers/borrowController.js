const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');
const Fine = require('../models/Fine');
const notify = require('../utils/notify');

const FINE_PER_DAY = () => Number(process.env.FINE_PER_DAY || 5);
const BORROW_DAYS = () => Number(process.env.BORROW_DAYS || 14);
const MAX_BOOKS = () => Number(process.env.MAX_BOOKS_PER_STUDENT || 5);

// @desc    Issue a book to a student
// @route   POST /api/borrowings/issue
// @access  Private/Admin
const issueBook = asyncHandler(async (req, res) => {
  const { userId, bookId, dueDate } = req.body;

  const [student, book] = await Promise.all([User.findById(userId), Book.findById(bookId)]);
  if (!student || student.role !== 'student') throw new ApiError(404, 'Student not found');
  if (!book) throw new ApiError(404, 'Book not found');
  if (book.availableCopies < 1) throw new ApiError(400, 'No copies of this book are currently available');

  const activeCount = await Borrowing.countDocuments({ user: userId, status: { $ne: 'returned' } });
  if (activeCount >= MAX_BOOKS()) {
    throw new ApiError(400, `Student has reached the borrowing limit of ${MAX_BOOKS()} books`);
  }

  const alreadyHolding = await Borrowing.findOne({ user: userId, book: bookId, status: { $ne: 'returned' } });
  if (alreadyHolding) throw new ApiError(400, 'This student already has this book issued');

  const issueDate = new Date();
  const computedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + BORROW_DAYS() * 86400000);

  const borrowing = await Borrowing.create({
    user: userId,
    book: bookId,
    issueDate,
    dueDate: computedDueDate,
    status: 'issued',
    issuedBy: req.user._id,
  });

  book.availableCopies -= 1;
  await book.save();

  await notify({
    user: userId,
    title: 'Book issued',
    message: `"${book.title}" has been issued to you. Due back on ${computedDueDate.toDateString()}.`,
    type: 'book_issued',
  });

  const populated = await borrowing.populate([
    { path: 'book', select: 'title author coverImage' },
    { path: 'user', select: 'name studentId' },
  ]);

  res.status(201).json({ success: true, message: 'Book issued successfully.', borrowing: populated });
});

// @desc    Return a book, auto-calculating any late fine
// @route   POST /api/borrowings/:id/return
// @access  Private/Admin
const returnBook = asyncHandler(async (req, res) => {
  const borrowing = await Borrowing.findById(req.params.id).populate('book').populate('user', 'name studentId');
  if (!borrowing) throw new ApiError(404, 'Borrowing record not found');
  if (borrowing.status === 'returned') throw new ApiError(400, 'This book has already been returned');

  const returnDate = new Date();
  const lateDays = Math.max(0, Math.ceil((returnDate - borrowing.dueDate) / 86400000));
  const fineAmount = lateDays * FINE_PER_DAY();

  borrowing.returnDate = returnDate;
  borrowing.status = 'returned';
  borrowing.returnedTo = req.user._id;

  let fine = null;
  if (fineAmount > 0) {
    fine = await Fine.create({
      user: borrowing.user._id,
      borrowing: borrowing._id,
      book: borrowing.book._id,
      lateDays,
      amount: fineAmount,
      status: 'pending',
    });
    borrowing.fine = fine._id;
  }

  await borrowing.save();

  const book = await Book.findById(borrowing.book._id);
  book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
  await book.save();

  await notify({
    user: borrowing.user._id,
    title: 'Book returned',
    message:
      lateDays > 0
        ? `"${borrowing.book.title}" was returned ${lateDays} day(s) late. A fine of ₹${fineAmount} has been applied.`
        : `"${borrowing.book.title}" was returned on time. Thanks!`,
    type: 'book_returned',
  });

  res.json({
    success: true,
    message: 'Book returned successfully.',
    borrowing,
    lateDays,
    fine,
  });
});

// @desc    List borrowings (admin: all with filters; student: own only)
// @route   GET /api/borrowings
// @access  Private
const getBorrowings = asyncHandler(async (req, res) => {
  const { status, userId, page = 1, limit = 20 } = req.query;
  const query = {};

  if (req.user.role === 'student') {
    query.user = req.user._id;
  } else if (userId) {
    query.user = userId;
  }

  if (status) query.status = status;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const now = new Date();
  // Lazily flag overdue records so lists stay accurate without a cron job.
  await Borrowing.updateMany(
    { status: 'issued', dueDate: { $lt: now } },
    { $set: { status: 'overdue' } }
  );

  const [borrowings, total] = await Promise.all([
    Borrowing.find(query)
      .populate('book', 'title author coverImage')
      .populate('user', 'name studentId email')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Borrowing.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: borrowings.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    borrowings,
  });
});

// @desc    Currently borrowed books for the logged-in student
// @route   GET /api/borrowings/my-current
// @access  Private/Student
const getMyCurrentBorrowings = asyncHandler(async (req, res) => {
  const now = new Date();
  await Borrowing.updateMany(
    { user: req.user._id, status: 'issued', dueDate: { $lt: now } },
    { $set: { status: 'overdue' } }
  );

  const borrowings = await Borrowing.find({ user: req.user._id, status: { $ne: 'returned' } })
    .populate('book', 'title author coverImage')
    .sort('dueDate');

  res.json({ success: true, borrowings });
});

module.exports = { issueBook, returnBook, getBorrowings, getMyCurrentBorrowings };
