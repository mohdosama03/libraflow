const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  studentId: user.studentId,
  phone: user.phone,
  profileImage: user.profileImage,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone, role: 'student' });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: generateToken(user._id, user.role),
    user: sanitizeUser(user),
  });
});

// @desc    Login (student or admin)
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (role && user.role !== role) {
    throw new ApiError(401, `No ${role} account found with these credentials`);
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated. Contact the library.');
  }

  res.json({
    success: true,
    message: 'Logged in successfully',
    token: generateToken(user._id, user.role),
    user: sanitizeUser(user),
  });
});

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

// @desc    Request a password reset link (demo/UI-only implementation)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way, whether or not the account exists,
  // so the endpoint can't be used to enumerate registered emails.
  res.json({
    success: true,
    message: 'If an account exists for that email, a reset link has been sent.',
    _demoNote: user ? undefined : 'No account found for this email (visible only in dev).',
  });
});

module.exports = { register, login, getMe, forgotPassword, sanitizeUser };
