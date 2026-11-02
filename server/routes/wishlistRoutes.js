const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

const router = express.Router();

router.use(protect, authorize('student'));

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:bookId', removeFromWishlist);

module.exports = router;
