// const express = require('express');
// const router = express.Router();
// const adminAuthController = require('../controllers/adminAuth.controller');

// /**
//  * @swagger
//  * tags:
//  *   name: Admin Auth
//  *   description: Admin authentication
//  */

// /**
//  * @swagger
//  * /api/admin/login:
//  *   post:
//  *     summary: Admin login
//  *     tags: [Admin Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: admin@example.com
//  *               password:
//  *                 type: string
//  *                 example: admin123
//  *     responses:
//  *       200:
//  *         description: Successfully logged in
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 token:
//  *                   type: string
//  *                 role:
//  *                   type: string
//  *                   example: admin
//  *       400:
//  *         description: Invalid credentials
//  *       403:
//  *         description: Access denied
//  */
// router.post('/login', adminAuthController.login);

// module.exports = router;
