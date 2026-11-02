const QRCode = require('qrcode');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Borrowing = require('../models/Borrowing');
const Wishlist = require('../models/Wishlist');

// @desc    List books with search, filters, sorting, pagination
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    author,
    availability,
    sort = '-createdAt',
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { isbn: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (author) query.author = { $regex: author, $options: 'i' };
  if (availability === 'available') query.availableCopies = { $gt: 0 };
  if (availability === 'unavailable') query.availableCopies = { $lte: 0 };

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [books, total] = await Promise.all([
    Book.find(query).populate('category', 'name').sort(sort).skip(skip).limit(limitNum),
    Book.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: books.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    books,
  });
});

// @desc    Get a single book by id
// @route   GET /api/books/:id
// @access  Public
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('category', 'name');
  if (!book) throw new ApiError(404, 'Book not found');

  const reviews = await Review.find({ book: book._id }).populate('user', 'name');

  res.json({ success: true, book, reviews });
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  payload.availableCopies =
    payload.availableCopies !== undefined ? payload.availableCopies : payload.totalCopies;

  const book = await Book.create(payload);

  const qrPayload = JSON.stringify({ bookId: book._id.toString(), title: book.title });
  book.qrCode = await QRCode.toDataURL(qrPayload);
  await book.save();

  res.status(201).json({ success: true, message: 'Book added successfully', book });
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');

  const { totalCopies } = req.body;
  if (totalCopies !== undefined) {
    const diff = totalCopies - book.totalCopies;
    book.availableCopies = Math.max(0, book.availableCopies + diff);
  }

  Object.assign(book, req.body, { totalCopies: totalCopies ?? book.totalCopies });
  await book.save();

  res.json({ success: true, message: 'Book updated successfully', book });
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');

  const activeBorrow = await Borrowing.findOne({ book: book._id, status: { $ne: 'returned' } });
  if (activeBorrow) {
    throw new ApiError(400, 'Cannot delete a book that currently has active borrowings');
  }

  await Promise.all([book.deleteOne(), Wishlist.deleteMany({ book: book._id })]);

  res.json({ success: true, message: 'Book deleted successfully' });
});

// @desc    Popular books (by rating, then borrow count)
// @route   GET /api/books/popular
// @access  Public
const getPopularBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate('category', 'name').sort('-rating -ratingCount').limit(8);
  res.json({ success: true, books });
});

// @desc    Recently added books
// @route   GET /api/books/recent
// @access  Public
const getRecentBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate('category', 'name').sort('-createdAt').limit(8);
  res.json({ success: true, books });
});

// @desc    Personalized recommendations based on wishlist / borrowing history / favorite categories
// @route   GET /api/books/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [wishlist, history] = await Promise.all([
    Wishlist.find({ user: userId }).populate('book', 'category'),
    Borrowing.find({ user: userId }).populate('book', 'category'),
  ]);

  const categoryIds = new Set(
    [...wishlist.map((w) => w.book?.category?.toString()), ...history.map((h) => h.book?.category?.toString())].filter(Boolean)
  );
  req.user.favoriteCategories.forEach((c) => categoryIds.add(c.toString()));

  const excludeBookIds = [
    ...wishlist.map((w) => w.book?._id),
    ...history.map((h) => h.book?._id),
  ].filter(Boolean);

  let books = [];
  if (categoryIds.size > 0) {
    books = await Book.find({
      category: { $in: Array.from(categoryIds) },
      _id: { $nin: excludeBookIds },
    })
      .populate('category', 'name')
      .sort('-rating')
      .limit(6);
  }

  if (books.length < 4) {
    const fallback = await Book.find({ _id: { $nin: [...excludeBookIds, ...books.map((b) => b._id)] } })
      .populate('category', 'name')
      .sort('-rating')
      .limit(6 - books.length);
    books = [...books, ...fallback];
  }

  res.json({ success: true, books });
});

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getPopularBooks,
  getRecentBooks,
  getRecommendations,
};
