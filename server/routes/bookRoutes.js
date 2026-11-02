const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getPopularBooks,
  getRecentBooks,
  getRecommendations,
} = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');

const router = express.Router();

router.get('/popular', getPopularBooks);
router.get('/recent', getRecentBooks);
router.get('/recommendations', protect, getRecommendations);

router.get('/', getBooks);
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('isbn').trim().notEmpty().withMessage('ISBN is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('totalCopies').isInt({ min: 0 }).withMessage('Total copies must be a positive number'),
  ],
  validate,
  createBook
);

router.get('/:id', getBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

router.post(
  '/:id/reviews',
  protect,
  authorize('student'),
  [body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')],
  validate,
  addReview
);

module.exports = router;
