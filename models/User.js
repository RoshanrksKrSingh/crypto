const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },

  role: {
    type: String,
    enum: ['admin', 'merchant', 'user'],
    default: 'user'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // For linking users to a merchant
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  otp: { type: String },
  otpExpiry: { type: Date },
  otpPurpose: {
    type: String,
    enum: ['registration', 'reset'],
    default: null,
  },
}, {
  timestamps: true, // createdAt and updatedAt
});

// Capitalize first and last name
userSchema.pre('save', function (next) {
  if (this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  }
  if (this.lastName) {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
  }
  next();
});

//  Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
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

