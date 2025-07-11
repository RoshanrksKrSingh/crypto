const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['admin', 'merchant', 'user'],
    default: 'user'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // Only for users who are linked to a merchant
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // OTP handling
  otp: { type: String },
  otpExpiry: { type: Date },
  otpPurpose: { type: String },
}, {
  timestamps: true // Adds createdAt and updatedAt
});
// Capitalize first letter of firstName and lastName
// userSchema.pre('save', function (next) {
//   if (this.firstName) {
//     this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
//   }
//   if (this.lastName) {
//     this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
//   }
//   next();
// });

module.exports = mongoose.model('User', userSchema);
