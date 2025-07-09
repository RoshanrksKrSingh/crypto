const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

/**
 * Admin creates a merchant
 */
exports.createMerchant = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, /*role*/ } = req.body;

    // Check if merchant already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Merchant already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const merchant = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'merchant',
      // canSignup: true,
      isVerified: true,
    });

    res.status(201).json({ message: 'Merchant created by admin', merchant });
  } catch (err) {
    res.status(500).json({ message: 'Error creating merchant', error: err.message });
  }
};

/**
 * Admin updates merchant details
 */
exports.updateMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const {firstName,lastName,email, phone,password,role} = req.body;

    const updateData = {firstName,lastName,email,phone,role};

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedMerchant = await User.findByIdAndUpdate(id, updateData, { new: true });

    // If merchant not found
    if (!updatedMerchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    // Success response
    res.json({
      message: 'Merchant updated successfully',
      merchant: updatedMerchant
    });

  } catch (err) {
    res.status(500).json({
      message: 'Error updating merchant',
      error: err.message
    });
  }
};

/**
 * Admin deletes a merchant
 */
exports.deleteMerchant = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Merchant deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting merchant', error: err.message });
  }
};
// Create User
exports.createUser = async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    role
  });

  res.status(201).json({ message: 'User created', user: newUser });
};

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, password, role } = req.body;

  const updateData = { firstName, lastName, email, phone, password, role }
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

  if (!updatedUser) return res.status(404).json({ message: 'User not found' });

  res.json({ message: 'User updated', user: updatedUser });
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return res.status(404).json({ message: 'User not found' });

  res.json({ message: 'User deleted' });
};

//Admin Get all Users

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Admin Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'name email merchantId');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// Admin Get transactions by userId or merchantId
exports.getTransactionsByUserOrMerchant = async (req, res) => {
  const { userId, merchantId } = req.query;

  try {
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (merchantId) {
      const users = await User.find({ merchantId }).select('_id');
      const userIds = users.map(u => u._id);
      query.userId = { $in: userIds };
    }

    const transactions = await Transaction.find(query).populate('userId', 'name email merchantId');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching filtered transactions' });
  }
};
