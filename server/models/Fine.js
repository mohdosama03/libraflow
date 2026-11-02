const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowing: { type: mongoose.Schema.Types.ObjectId, ref: 'Borrowing', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    lateDays: { type: Number, required: true, default: 0 },
    amount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['pending', 'paid', 'waived'], default: 'pending' },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fine', fineSchema);
