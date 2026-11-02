const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const {
  issueBook,
  returnBook,
  getBorrowings,
  getMyCurrentBorrowings,
} = require('../controllers/borrowController');

const router = express.Router();

router.get('/', protect, getBorrowings);
router.get('/my-current', protect, authorize('student'), getMyCurrentBorrowings);

router.post(
  '/issue',
  protect,
  authorize('admin'),
  [body('userId').notEmpty(), body('bookId').notEmpty()],
  validate,
  issueBook
);

router.post('/:id/return', protect, authorize('admin'), returnBook);

module.exports = router;
