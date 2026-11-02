const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getPublicStats,
  getStudentDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');

const router = express.Router();

router.get('/public-stats', getPublicStats);
router.get('/student', protect, authorize('student'), getStudentDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
