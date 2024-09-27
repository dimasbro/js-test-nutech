const express = require('express');
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/jwt'); // Import JWT middleware
const { getProfile, updateProfile, updateUserProfileImage } = require('../controllers/profileController'); // Import profile controller
const router = express.Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [1. Module Membership]
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
router.get('/profile', verifyToken, getProfile);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     tags: [1. Module Membership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *             required:
 *               - first_name
 *               - last_name
 *     responses:
 *       200:
 *         description: Update Pofile berhasil
 *       401:
 *         description: Token tidak tidak valid atau kadaluwarsa
 */
router.put('/profile/update', [
    check('first_name')
        .notEmpty().withMessage('Parameter first_name harus di isi'),
    check('last_name')
        .notEmpty().withMessage('Parameter last_name harus di isi'),
], verifyToken, updateProfile);

/**
 * @swagger
 * /profile/image:
 *   put:
 *     tags: [1. Module Membership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Update Profile Image berhasil
 *       400:
 *         description: Format Image tidak sesuai
 *       401:
 *         description: Token tidak tidak valid atau kadaluwarsa
 */
router.put('/profile/image', verifyToken, updateUserProfileImage);

module.exports = router;
