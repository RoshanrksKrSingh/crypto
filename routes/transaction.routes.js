const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { protect, adminOnly  } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transactions using TronGrid
 */

/**
 * @swagger
 * /api/transactions/create:
 *   post:
 *     summary: Create a crypto transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - receiver
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50.5
 *               receiver:
 *                 type: string
 *                 example: TN1h4XoVjfYFZ3KZugRpVSDUKC3qFSNGU6
 *     responses:
 *       201:
 *         description: Transaction created successfully
 */
router.post('/create', protect, transactionController.createTransaction);

/**
 * @swagger
 * /api/transactions/status/{txId}:
 *   get:
 *     summary: Get transaction status
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: txId
 *         required: true
 *         schema:
 *           type: string
 *           example: 1f4ac0dcaa2fbcaa44123e
 *     responses:
 *       200:
 *         description: Transaction status retrieved
 */
router.get('/status/:txId', protect, transactionController.getTransactionStatus);
/**
 * @swagger
 * /api/transactions/all:
 *   get:
 *     summary: Get all transactions (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 *       403:
 *         description: Forbidden
 */
router.get('/all', protect, adminOnly , transactionController.getAllTransactions);

module.exports = router;
