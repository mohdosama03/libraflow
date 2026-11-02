const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/requestController');

const router = express.Router();

router.get('/', protect, getRequests);
router.post('/', protect, authorize('student'), [body('bookId').notEmpty()], validate, createRequest);
router.patch('/:id', protect, authorize('admin'), updateRequestStatus);

module.exports = router;
