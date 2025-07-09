const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant.controller');
const { protect, merchantOnly } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Merchant
 *   description: Merchant operations
 */

/**
 * @swagger
 * /api/merchant/create-user:
 *   post:
 *     summary: Create user under merchant
 *     tags: [Merchant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/create-user', protect, merchantOnly, merchantController.createUser);

/**
 * @swagger
 * /api/merchant/update-user/{id}:
 *   put:
 *     summary: Update a user created by the merchant
 *     tags: [Merchant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               laststName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated sucessfully
 */
router.put('/update-user/:id', protect, merchantOnly, merchantController.updateUser);

/**
 * @swagger
 * /api/merchant/delete-user/{id}:
 *   delete:
 *     summary: Delete a user created by the merchant
 *     tags: [Merchant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/delete-user/:id', protect, merchantOnly, merchantController.deleteUser);

/**
 * @swagger
 * /api/merchant/get-user/{id}:
 *   get:
 *     summary: Get a user under this merchant
 *     tags: [Merchant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 */
router.get('/get-user/:id', protect, merchantOnly, merchantController.getUserById);

/**
 * @swagger
 * /api/merchant/user-transactions:
 *   get:
 *     summary: Get all transactions of users created by this merchant
 *     tags: [Merchant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/user-transactions', protect, merchantOnly, merchantController.getMerchantUserTransactions);

module.exports = router;
