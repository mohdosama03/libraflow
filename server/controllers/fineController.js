const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Fine = require('../models/Fine');

// @desc    List fines (admin: all with filters; student: own)
// @route   GET /api/fines
// @access  Private
const getFines = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (req.user.role === 'student') query.user = req.user._id;
  if (status) query.status = status;

  const fines = await Fine.find(query)
    .populate('book', 'title author')
    .populate('user', 'name studentId')
    .sort('-createdAt');

  const totalOutstanding = fines
    .filter((f) => f.status === 'pending')
    .reduce((sum, f) => sum + f.amount, 0);

  res.json({ success: true, fines, totalOutstanding });
});

// @desc    Mark a fine as paid or waived
// @route   PATCH /api/fines/:id
// @access  Private/Admin
const updateFineStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['paid', 'waived', 'pending'].includes(status)) {
    throw new ApiError(400, 'Invalid fine status');
  }

  const fine = await Fine.findById(req.params.id);
  if (!fine) throw new ApiError(404, 'Fine not found');

  fine.status = status;
  fine.paidAt = status === 'paid' ? new Date() : null;
  await fine.save();

  res.json({ success: true, message: `Fine marked as ${status}.`, fine });
});

module.exports = { getFines, updateFineStatus };
