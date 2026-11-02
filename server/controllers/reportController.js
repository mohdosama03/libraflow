const asyncHandler = require('../utils/asyncHandler');
const Book = require('../models/Book');
const User = require('../models/User');
const Borrowing = require('../models/Borrowing');
const Fine = require('../models/Fine');

// @desc    Consolidated library report
// @route   GET /api/reports
// @access  Private/Admin
const getReport = asyncHandler(async (req, res) => {
  const [totalBooks, booksIssued, booksReturned, overdueBooks, totalStudents, fines] = await Promise.all([
    Book.countDocuments(),
    Borrowing.countDocuments(),
    Borrowing.countDocuments({ status: 'returned' }),
    Borrowing.countDocuments({ status: 'overdue' }),
    User.countDocuments({ role: 'student' }),
    Fine.find(),
  ]);

  const fineCollected = fines.filter((f) => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const finePending = fines.filter((f) => f.status === 'pending').reduce((s, f) => s + f.amount, 0);

  const mostBorrowedBooks = await Borrowing.aggregate([
    { $group: { _id: '$book', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
    { $unwind: '$book' },
    { $project: { title: '$book.title', author: '$book.author', count: 1 } },
  ]);

  const mostActiveStudents = await Borrowing.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { name: '$user.name', studentId: '$user.studentId', count: 1 } },
  ]);

  const categoryStats = await Book.aggregate([
    { $group: { _id: '$category', totalCopies: { $sum: '$totalCopies' }, titles: { $sum: 1 } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { name: '$category.name', totalCopies: 1, titles: 1 } },
    { $sort: { totalCopies: -1 } },
  ]);

  res.json({
    success: true,
    summary: {
      totalBooks,
      booksIssued,
      booksReturned,
      overdueBooks,
      totalStudents,
      fineCollected,
      finePending,
    },
    mostBorrowedBooks,
    mostActiveStudents,
    categoryStats,
  });
});

module.exports = { getReport };
