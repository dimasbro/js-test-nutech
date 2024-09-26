const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController'); 
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *         description: User registrasi berhasil
 *       402:
 *         description: User registrasi gagal
 */
router.post('/register', [
    check('email')
        .notEmpty().withMessage('Email harus diisi')
        .isLength({ min: 10 }).withMessage('Email minimal 10 karakter')
        .isEmail().withMessage('Email tidak valid'),
    check('first_name')
        .notEmpty().withMessage('First name harus diisi')
        .isLength({ min: 3 }).withMessage('First name minimal 3 karakter'),
    check('last_name')
        .notEmpty().withMessage('Last name harus diisi')
        .isLength({ min: 3 }).withMessage('Last name minimal 3 karakter'),
    check('password')
        .notEmpty().withMessage('Password harus diisi')
        .isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
], register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
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
 *       403:
 *         description: Email dan password tidak cocok
 */
router.post('/login', [
    check('email')
        .notEmpty().withMessage('Email harus diisi')
        .isLength({ min: 10 }).withMessage('Email minimal 10 karakter')
        .isEmail().withMessage('Email tidak valid'),
    check('password')
        .notEmpty().withMessage('Password harus diisi')
        .isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
], login);

module.exports = router;