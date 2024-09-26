const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/jwt'); // Import JWT utility
const db = require('../config/db'); // Import your DB connection

// Register
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ status: false, message: errorMessages[0], data: null });
    }

    const { email, first_name, last_name, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)', [email, first_name, last_name, hashedPassword], (err, results) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'User registrasi gagal', data: null });
        }
        res.status(201).json({ status: true, message: 'User registrasi berhasil', data: null });
    });
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ status: false, message: errorMessages[0], data: null });
    }

    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({ status: false, message: 'Email tidak terdaftar', data: null });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ status: false, message: 'Email dan password tidak cocok', data: null });
        }

        const token = generateToken(user.id);
        res.status(200).json({ status: true, message: 'Login sukses', data: {token: token} });
    });
};