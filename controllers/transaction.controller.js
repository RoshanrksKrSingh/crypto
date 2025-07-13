const Transaction = require('../models/Transaction');
const { verifyTronTransaction } = require('../services/cryptoPayment');
const User = require('../models/User');

exports.createTransaction = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const trx = await Transaction.create({
      ...req.body,
      userId: user._id,
      merchantId: user.merchantId || null
    });

    res.status(201).json({ message: 'Transaction created successfully', transaction: trx });
  } catch (err) {
    console.error('Transaction creation failed:', err);
    res.status(500).json({ message: 'Transaction creation failed', error: err.message });
  }
};

exports.verifyTransaction = async (req, res) => {
  try {
    const trxData = await verifyTronTransaction(req.params.hash);
    res.json(trxData);
  } catch (err) {
    console.error('Transaction verification failed:', err);
    res.status(500).json({ message: 'Transaction verification failed', error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const txns = await Transaction.find({ userId: req.user._id });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user transactions', error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find().populate('userId', 'firstName lastName email role');
    res.json(txns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all transactions', error: err.message });
  }
};

exports.getTransactionStatus = async (req, res) => {
  try {
    const trx = await Transaction.findById(req.params.txId);
    if (!trx) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ status: trx.status, transaction: trx });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get transaction status', error: err.message });
  }
};
