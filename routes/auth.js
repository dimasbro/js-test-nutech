const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController'); 
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 1. Module Membership
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *     responses:
 *       200:
 *         description: Registrasi berhasil silahkan login
 *       400:
 *         description: Paramter email tidak sesuai format
 */
router.post('/register', [
    check('email')
        .notEmpty().withMessage('Parameter email harus di isi')
        .isEmail().withMessage('Paramter email tidak sesuai format'),
    check('first_name')
        .notEmpty().withMessage('Parameter first_name harus di isi'),
    check('last_name')
        .notEmpty().withMessage('Parameter last_name harus di isi'),
    check('password')
        .notEmpty().withMessage('Parameter password harus di isi')
        .isLength({ min: 8 }).withMessage('Password length minimal 8 karakter'),
], register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login sukses
 *       400:
 *         description: Paramter email tidak sesuai format
 *       401:
 *         description: Username atau password salah
 */
router.post('/login', [
    check('email')
        .notEmpty().withMessage('Parameter email harus di isi')
        .isEmail().withMessage('Paramter email tidak sesuai format'),
    check('password')
        .notEmpty().withMessage('Parameter password harus di isi')
        .isLength({ min: 8 }).withMessage('Password length minimal 8 karakter'),
], login);

module.exports = router;