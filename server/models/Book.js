const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    publisher: { type: String, trim: true },
    publicationYear: { type: Number },
    description: { type: String, trim: true, default: '' },
    coverImage: { type: String, default: '' },
    totalCopies: { type: Number, required: true, min: 0, default: 1 },
    availableCopies: { type: Number, required: true, min: 0, default: 1 },
    shelfNumber: { type: String, default: 'N/A' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    qrCode: { type: String, default: '' },
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text', isbn: 'text' });

bookSchema.virtual('status').get(function () {
  return this.availableCopies > 0 ? 'available' : 'unavailable';
});

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);
