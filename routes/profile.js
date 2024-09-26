const express = require('express');
const upload = require('../middleware/upload'); // Import the upload middleware
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/jwt'); // Import JWT middleware
const { getProfile, updateProfile, updateUserProfileImage } = require('../controllers/profileController'); // Import profile controller
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
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
router.get('/profile', verifyToken, getProfile);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
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
 *         description: Profile berhasil di update
 *       403:
 *         description: Profile gagal di update
 */
router.put('/profile/update', [
    check('first_name')
        .notEmpty().withMessage('First name harus diisi')
        .isLength({ min: 3 }).withMessage('First name minimal 3 karakter'),
    check('last_name')
        .notEmpty().withMessage('Last name harus diisi')
        .isLength({ min: 3 }).withMessage('Last name minimal 3 karakter'),
], verifyToken, updateProfile);

/**
 * @swagger
 * /profile/image:
 *   put:
 *     summary: Update user profile image
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile berhasil di update
 *       403:
 *         description: Profile gagal di update
 */
router.put('/profile/image', upload, verifyToken, updateUserProfileImage);

module.exports = router;
