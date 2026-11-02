const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Request = require('../models/Request');
const Book = require('../models/Book');
const notify = require('../utils/notify');

// @desc    Create a book request
// @route   POST /api/requests
// @access  Private/Student
const createRequest = asyncHandler(async (req, res) => {
  const { bookId, note } = req.body;

  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(404, 'Book not found');

  const existing = await Request.findOne({ user: req.user._id, book: bookId, status: 'pending' });
  if (existing) throw new ApiError(400, 'You already have a pending request for this book');

  const request = await Request.create({ user: req.user._id, book: bookId, note });
  const populated = await request.populate('book', 'title author coverImage');

  res.status(201).json({ success: true, message: 'Book request submitted successfully.', request: populated });
});

// @desc    List requests (admin: all; student: own)
// @route   GET /api/requests
// @access  Private
const getRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (req.user.role === 'student') query.user = req.user._id;
  if (status) query.status = status;

  const requests = await Request.find(query)
    .populate('book', 'title author coverImage availableCopies')
    .populate('user', 'name studentId email')
    .sort('-createdAt');

  res.json({ success: true, requests });
});

// @desc    Approve or reject a request
// @route   PATCH /api/requests/:id
// @access  Private/Admin
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'completed'].includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const request = await Request.findById(req.params.id).populate('book', 'title');
  if (!request) throw new ApiError(404, 'Request not found');

  request.status = status;
  request.resolvedBy = req.user._id;
  request.resolvedAt = new Date();
  await request.save();

  if (status === 'approved') {
    await notify({
      user: request.user,
      title: 'Request approved',
      message: `Your request for "${request.book.title}" was approved. Visit the desk to collect it.`,
      type: 'request_approved',
    });
  } else if (status === 'rejected') {
    await notify({
      user: request.user,
      title: 'Request rejected',
      message: `Your request for "${request.book.title}" was rejected.`,
      type: 'request_rejected',
    });
  }

  res.json({ success: true, message: `Request marked as ${status}.`, request });
});

module.exports = { createRequest, getRequests, updateRequestStatus };
