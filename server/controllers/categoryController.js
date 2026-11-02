const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Category = require('../models/Category');
const Book = require('../models/Book');

// @desc    List categories with book counts
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');

  const counts = await Book.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

  const withCounts = categories.map((c) => ({
    ...c.toObject(),
    bookCount: countMap[c._id.toString()] || 0,
  }));

  res.json({ success: true, categories: withCounts });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const existing = await Category.findOne({ name: req.body.name });
  if (existing) throw new ApiError(400, 'A category with this name already exists');

  const category = await Category.create(req.body);
  res.status(201).json({ success: true, message: 'Category created successfully', category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, message: 'Category updated successfully', category });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const bookCount = await Book.countDocuments({ category: req.params.id });
  if (bookCount > 0) {
    throw new ApiError(400, `Cannot delete: ${bookCount} book(s) still use this category`);
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  res.json({ success: true, message: 'Category deleted successfully' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
