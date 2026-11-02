const asyncHandler = require('../utils/asyncHandler');
const Book = require('../models/Book');
const User = require('../models/User');
const Borrowing = require('../models/Borrowing');
const Request = require('../models/Request');
const Fine = require('../models/Fine');

// @desc    Public homepage statistics
// @route   GET /api/dashboard/public-stats
// @access  Public
const getPublicStats = asyncHandler(async (req, res) => {
  const [totalBooksAgg, students, issuedBooks] = await Promise.all([
    Book.aggregate([
      { $group: { _id: null, totalBooks: { $sum: '$totalCopies' }, availableBooks: { $sum: '$availableCopies' } } },
    ]),
    User.countDocuments({ role: 'student' }),
    Borrowing.countDocuments({ status: { $ne: 'returned' } }),
  ]);

  const totals = totalBooksAgg[0] || { totalBooks: 0, availableBooks: 0 };

  res.json({
    success: true,
    stats: {
      totalBooks: totals.totalBooks,
      availableBooks: totals.availableBooks,
      registeredMembers: students,
      booksIssued: issuedBooks,
    },
  });
});

// @desc    Student dashboard summary
// @route   GET /api/dashboard/student
// @access  Private/Student
const getStudentDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  await Borrowing.updateMany(
    { user: userId, status: 'issued', dueDate: { $lt: now } },
    { $set: { status: 'overdue' } }
  );

  const [currentlyBorrowed, returned, pendingRequests, fines] = await Promise.all([
    Borrowing.countDocuments({ user: userId, status: { $ne: 'returned' } }),
    Borrowing.countDocuments({ user: userId, status: 'returned' }),
    Request.countDocuments({ user: userId, status: 'pending' }),
    Fine.find({ user: userId, status: 'pending' }),
  ]);

  const currentFine = fines.reduce((sum, f) => sum + f.amount, 0);

  const recentBorrowings = await Borrowing.find({ user: userId })
    .populate('book', 'title author coverImage')
    .sort('-createdAt')
    .limit(5);

  res.json({
    success: true,
    stats: { currentlyBorrowed, returned, pendingRequests, currentFine },
    recentBorrowings,
  });
});

// @desc    Admin dashboard summary + chart data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  await Borrowing.updateMany({ status: 'issued', dueDate: { $lt: now } }, { $set: { status: 'overdue' } });

  const [bookTotalsAgg, totalStudents, issuedBooks, overdueBooks, fines] = await Promise.all([
    Book.aggregate([
      { $group: { _id: null, totalBooks: { $sum: '$totalCopies' }, availableBooks: { $sum: '$availableCopies' } } },
    ]),
    User.countDocuments({ role: 'student' }),
    Borrowing.countDocuments({ status: { $ne: 'returned' } }),
    Borrowing.countDocuments({ status: 'overdue' }),
    Fine.find(),
  ]);

  const bookTotals = bookTotalsAgg[0] || { totalBooks: 0, availableBooks: 0 };
  const totalFines = fines.reduce((sum, f) => sum + f.amount, 0);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const [issuedByMonth, returnedByMonth] = await Promise.all([
    Borrowing.aggregate([
      { $match: { issueDate: { $gte: sixMonthsAgo } } },
      { $group: { _id: { y: { $year: '$issueDate' }, m: { $month: '$issueDate' } }, count: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
    Borrowing.aggregate([
      { $match: { returnDate: { $ne: null, $gte: sixMonthsAgo } } },
      { $group: { _id: { y: { $year: '$returnDate' }, m: { $month: '$returnDate' } }, count: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
  ]);

  const popularCategories = await Borrowing.aggregate([
    {
      $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'bookDoc' },
    },
    { $unwind: '$bookDoc' },
    {
      $lookup: { from: 'categories', localField: 'bookDoc.category', foreignField: '_id', as: 'categoryDoc' },
    },
    { $unwind: '$categoryDoc' },
    { $group: { _id: '$categoryDoc.name', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);

  const mostBorrowedBooks = await Borrowing.aggregate([
    { $group: { _id: '$book', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
    { $unwind: '$book' },
    { $project: { title: '$book.title', author: '$book.author', count: 1 } },
  ]);

  const monthLabel = (y, m) => new Date(y, m - 1, 1).toLocaleString('default', { month: 'short' });

  res.json({
    success: true,
    stats: {
      totalBooks: bookTotals.totalBooks,
      availableBooks: bookTotals.availableBooks,
      issuedBooks,
      totalStudents,
      overdueBooks,
      totalFines,
    },
    charts: {
      issuedByMonth: issuedByMonth.map((i) => ({ month: monthLabel(i._id.y, i._id.m), count: i.count })),
      returnedByMonth: returnedByMonth.map((i) => ({ month: monthLabel(i._id.y, i._id.m), count: i.count })),
      popularCategories: popularCategories.map((c) => ({ category: c._id, count: c.count })),
      mostBorrowedBooks,
    },
  });
});

module.exports = { getPublicStats, getStudentDashboard, getAdminDashboard };
