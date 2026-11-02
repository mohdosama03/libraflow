const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  updateProfile,
  getStudents,
  getStudentDetail,
  toggleStudentStatus,
} = require('../controllers/userController');

const router = express.Router();

router.put('/profile', protect, updateProfile);

router.get('/students', protect, authorize('admin'), getStudents);
router.get('/students/:id', protect, authorize('admin'), getStudentDetail);
router.patch('/students/:id/status', protect, authorize('admin'), toggleStudentStatus);

module.exports = router;
