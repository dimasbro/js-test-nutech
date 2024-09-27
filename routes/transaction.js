const express = require('express');
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/jwt'); // Import JWT middleware
const { getBalance, topUp, getTransactionHistory, postTransaction } = require('../controllers/transactionController'); // Import transaction controller
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Item System
 */

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Get balance
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */
router.get('/balance', verifyToken, getBalance);

/**
 * @swagger
 * /topup:
 *   post:
 *     summary: Topup
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               top_up_amount:
 *                 type: integer
 *             required:
 *               - top_up_amount
 *     responses:
 *       200:
 *         description: Profile berhasil di update
 *       403:
 *         description: Transaksi gagal disimpan
 */
router.post('/topup', verifyToken, topUp);

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Transaction
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_code:
 *                 type: string
 *             required:
 *               - service_code
 *     responses:
 *       200:
 *         description: Profile berhasil di update
 *       403:
 *         description: Transaksi gagal disimpan
 */
router.post('/transaction', [
    check('service_code')
        .notEmpty().withMessage('Parameter service_code harus di isi'),
], verifyToken, postTransaction);

/**
 * @swagger
 * /transaction/history:
 *   get:
 *     summary: Transaction history
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of transaction to return
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: offset
 *         in: query
 *         description: Number of transaction to skip before starting to collect the result set
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: A list of transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         service_code: string
 *                       amount:
 *                         type: integer
 *       403:
 *         description: Gagal dapatkan data
 */
router.get('/transaction/history', verifyToken, getTransactionHistory);

module.exports = router;