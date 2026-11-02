const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const Borrowing = require('../models/Borrowing');
const Fine = require('../models/Fine');
const { sanitizeUser } = require('./authController');

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, profileImage, password } = req.body;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (profileImage !== undefined) user.profileImage = profileImage;
  if (password) user.password = password;

  await user.save();
  res.json({ success: true, message: 'Profile updated successfully', user: sanitizeUser(user) });
});

// @desc    List students (admin) with search
// @route   GET /api/users/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const query = { role: 'student' };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
  }
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;

  const students = await User.find(query).sort('-createdAt');
  res.json({ success: true, count: students.length, students });
});

// @desc    Get a single student's detail, including history and fines
// @route   GET /api/users/students/:id
// @access  Private/Admin
const getStudentDetail = asyncHandler(async (req, res) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!student) throw new ApiError(404, 'Student not found');

  const [borrowings, fines] = await Promise.all([
    Borrowing.find({ user: student._id }).populate('book', 'title author coverImage').sort('-createdAt'),
    Fine.find({ user: student._id }).populate('book', 'title'),
  ]);

  const outstandingFines = fines
    .filter((f) => f.status === 'pending')
    .reduce((sum, f) => sum + f.amount, 0);

  res.json({
    success: true,
    student: sanitizeUser(student),
    borrowings,
    fines,
    outstandingFines,
    booksReturned: borrowings.filter((b) => b.status === 'returned').length,
    booksBorrowed: borrowings.length,
  });
});

// @desc    Activate or deactivate a student account
// @route   PATCH /api/users/students/:id/status
// @access  Private/Admin
const toggleStudentStatus = asyncHandler(async (req, res) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!student) throw new ApiError(404, 'Student not found');

  student.isActive = req.body.isActive ?? !student.isActive;
  await student.save();

  res.json({
    success: true,
    message: `Student ${student.isActive ? 'activated' : 'deactivated'} successfully`,
    student: sanitizeUser(student),
  });
});

module.exports = { updateProfile, getStudents, getStudentDetail, toggleStudentStatus };
