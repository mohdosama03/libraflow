const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// @desc    Get the logged-in student's wishlist
// @route   GET /api/wishlist
// @access  Private/Student
const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ user: req.user._id }).populate({
    path: 'book',
    populate: { path: 'category', select: 'name' },
  });
  res.json({ success: true, items });
});

// @desc    Add a book to the wishlist
// @route   POST /api/wishlist
// @access  Private/Student
const addToWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(404, 'Book not found');

  const existing = await Wishlist.findOne({ user: req.user._id, book: bookId });
  if (existing) throw new ApiError(400, 'This book is already in your wishlist');

  const item = await Wishlist.create({ user: req.user._id, book: bookId });
  res.status(201).json({ success: true, message: 'Added to wishlist.', item });
});

// @desc    Remove a book from the wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private/Student
const removeFromWishlist = asyncHandler(async (req, res) => {
  const result = await Wishlist.findOneAndDelete({ user: req.user._id, book: req.params.bookId });
  if (!result) throw new ApiError(404, 'This book is not in your wishlist');
  res.json({ success: true, message: 'Removed from wishlist.' });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
