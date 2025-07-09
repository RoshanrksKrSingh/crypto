const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true },
  amount: Number,
  currency: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  tronHash: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Transaction', transactionSchema);