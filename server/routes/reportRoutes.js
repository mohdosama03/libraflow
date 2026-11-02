const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/', protect, authorize('admin'), getReport);

module.exports = router;
