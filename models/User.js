const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: ['admin', 'merchant', 'user'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  otp: { type: String },
  otpExpiry: { type: Date },
  otpPurpose: { type: String },
});

module.exports = mongoose.model('User', userSchema);
