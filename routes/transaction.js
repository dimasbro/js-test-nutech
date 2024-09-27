const express = require('express');
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/jwt'); // Import JWT middleware
const { getBalance, topUp, getTransactionHistory, postTransaction } = require('../controllers/transactionController'); // Import transaction controller
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 3. Module Transaction
 */

/**
 * @swagger
 * /balance:
 *   get:
 *     tags: [3. Module Transaction]
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
*                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */
router.get('/balance', verifyToken, getBalance);

/**
 * @swagger
 * /topup:
 *   post:
 *     tags: [3. Module Transaction]
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
 *         description: Top Up Balance berhasil
 *       403:
 *         description: Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0
 *       401:
 *         description: Token tidak tidak valid atau kadaluwarsa
 */
router.post('/topup', verifyToken, topUp);

/**
 * @swagger
 * /transaction:
 *   post:
 *     tags: [3. Module Transaction]
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
 *         description: Transaksi berhasil
 *       403:
 *         description: Service ataus Layanan tidak ditemukan
 *       401:
 *         description: Token tidak tidak valid atau kadaluwarsa
 */
router.post('/transaction', [
    check('service_code')
        .notEmpty().withMessage('Parameter service_code harus di isi'),
], verifyToken, postTransaction);

/**
 * @swagger
 * /transaction/history:
 *   get:
 *     tags: [3. Module Transaction]
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
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       offset:
 *                         type: integer
 *                       limit:
 *                         type: integer
 *                       records:
 *                         type: string
 *       401:
 *         description: Token tidak tidak valid atau kadaluwarsa
 */
router.get('/transaction/history', verifyToken, getTransactionHistory);

module.exports = router;