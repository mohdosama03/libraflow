const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Add or update a review for a book
// @route   POST /api/books/:id/reviews
// @access  Private/Student
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, book: book._id },
    { rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  const allReviews = await Review.find({ book: book._id });
  book.ratingCount = allReviews.length;
  book.rating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await book.save();

  res.status(201).json({ success: true, message: 'Review saved successfully', review });
});

module.exports = { addReview };
