const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/mailer');
const generateToken = require('../services/generateToken');
const { generateOTP } = require('../services/otpService');
const TempOtp = require('../models/TempOtp');
const { JWT_SECRET } = require('../config/jwt');


// Register
const register = async (req, res) => {
  const { firstName, lastName, email, phone, password, role, merchantId } = req.body;

  if (!firstName || !lastName || !email || !phone || !password || !role) {
    return res.status(400).json({ message: 'All fields including role are required' });
  }

  if (role === 'merchant') {
    return res.status(403).json({ message: 'Merchants cannot self-register. Please contact admin.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    await TempOtp.deleteOne({ email });

    const tempOtp = new TempOtp({
      email,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      role,
      merchantId: role === 'merchant' ? merchantId : null,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await tempOtp.save();

    const emailResponse = await sendEmail({
      to: email,
      subject: 'Your Registration OTP',
      html: `<p>Your OTP is <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`,
    });

    if (!emailResponse.success) {
      console.error('Failed to send OTP email:', emailResponse.error);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    return res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.' });
  } catch (err) {
    console.error('Registration Error:', err.message);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Verify Registration OTP
const verifyRegistrationOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const tempOtpRecord = await TempOtp.findOne({ email });

    if (!tempOtpRecord || tempOtpRecord.otp !== otp || tempOtpRecord.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = new User({
      firstName: tempOtpRecord.firstName,
      lastName: tempOtpRecord.lastName,
      email: tempOtpRecord.email,
      phone: tempOtpRecord.phone,
      password: tempOtpRecord.password,
      role: tempOtpRecord.role,
      merchantId: tempOtpRecord.merchantId || null,
      isVerified: true,
    });
    
    await user.save();
    await TempOtp.deleteOne({ email });
    
    return res.status(201).json({ message: 'Registration successful. You can now login.' });
  } catch (err) {
    console.error('OTP Verification Error:', err.message);
    res.status(500).json({ message: 'Verification failed' });
  }
};

// Login

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('merchantId');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    
if (user.role === 'merchant' && !user.isVerified) {
  return res.status(403).json({ message: 'Please contact admin  before logging in.' });
}
    const token = generateToken(user);

    return res.status(200).json({
  message: 'Login successful',
  token,
  role: user.role,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  id: user._id,
});
  } catch (err) {
    console.error('Login Error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Forgot Password

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!['user', 'merchant'].includes(user.role)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpPurpose = 'reset';

    await user.save();

    const emailResponse = await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    if (!emailResponse.success) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify Reset OTP
const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpPurpose !== 'reset' || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.otpPurpose = null;

    await user.save();

    // const passwordResetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    const passwordResetToken =generateToken(user);
    return res.status(200).json({
      message: 'OTP verified successfully',
      passwordResetToken,
    });
  } catch (err) {
    console.error('Verify OTP Error:', err.message);
    return res.status(500).json({ message: 'Error verifying OTP' });
  }
};
// Reset Password
const resetPassword = async (req, res) => {
  const { passwordResetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(passwordResetToken, JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }
};

module.exports = {
  register,
  verifyRegistrationOTP,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
