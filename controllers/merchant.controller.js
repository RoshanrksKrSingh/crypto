const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose'); 

/**
 * Create user by merchant or admin
 */
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      isVerified: true,
      merchantId: req.user.role === 'merchant' ? req.user._id : null, // only for merchant
    });

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

/**
 * Update user or merchant by admin/merchant
 */
exports.updateUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Only allow merchant to update their own users
    if (req.user.role === 'merchant' && targetUser.merchantId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this user' });
    }

    // Hash the new password if provided
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ message: 'User updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

/**
 * Delete user or merchant by admin/merchant
 */
exports.deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (req.user.role === 'merchant' && targetUser.merchantId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

/**
 * Get profile admin can get any, merchant can get users under them
 */
exports.getUserById = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    if (
      req.user.role === 'merchant' &&
      targetUser.role === 'user' &&
      targetUser.merchantId?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json({ user: targetUser });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};
// Get all users created by this merchant
exports.getAllUsersByMerchant = async (req, res) => {
  try {
    const users = await User.find({
      merchantId: req.user._id,
      role: 'user',
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};
exports.getMerchantUserTransactions = async (req, res) => {
  try {
    const merchantId = req.user._id;

    // Make sure merchant exists and is logged in
    const users = await User.find({ merchantId: merchantId }).select('_id');
    const userIds = users.map(u => u._id);

    // Fetch transactions of users under this merchant
    const transactions = await Transaction.find({ userId: { $in: userIds } })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error('Error in getMerchantUserTransactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};