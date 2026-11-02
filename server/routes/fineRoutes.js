const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getFines, updateFineStatus } = require('../controllers/fineController');

const router = express.Router();

router.get('/', protect, getFines);
router.patch('/:id', protect, authorize('admin'), updateFineStatus);

module.exports = router;
