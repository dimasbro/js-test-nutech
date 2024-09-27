const { validationResult } = require('express-validator');
const db = require('../config/db'); // Import your DB connection

// Get user profile
exports.getProfile = (req, res) => {
    const emailLogin = req.emailLogin; // Email login from the verified token

    db.query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [emailLogin], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ status: 103, message: 'Profile tidak ditemukan', data: null });
        }
        return res.status(200).json({ status: 0, message: 'Sukses', data: results[0] });
    });
};

// Update user profile
exports.updateProfile = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ status: 102, message: errorMessages[0], data: null });
    }
    
    const emailLogin = req.emailLogin; // Email login from the verified token
    const { first_name, last_name } = req.body; // Assume we only allow updating

    db.query('UPDATE users SET first_name = ?, last_name = ? WHERE email = ?', [first_name, last_name, emailLogin], (err, results) => {
        if (err) {
            return res.status(401).json({ status: 103, message: 'Profile gagal di update', data: null });
        }

        db.query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [emailLogin], (err, results) => {
            if (err || results.length === 0) {
                return res.status(401).json({ status: 103, message: 'Profile tidak ditemukan', data: null });
            }
            return res.status(200).json({ status: 0, message: 'Sukses', data: results[0] });
        });
    });
};

exports.updateUserProfileImage = (req, res) => {
    const emailLogin = req.emailLogin; // Email login from the verified token

    if (!req.file) {
        return res.status(400).json({ status: 102, message: 'Field file tidak boleh kosong', data: null });
    }

    const profileImagePath = req.file.path.replace(/\\/g, '/');; // Get the path of the uploaded file

    // Update the user's profile image in the database
    db.query('UPDATE users SET profile_image = ? WHERE email = ?', [req.protocol + '://' + req.get('host')+'/'+profileImagePath, emailLogin], (err, results) => {
        if (err) {
            return res.status(401).json({ status: 103, message: 'Profile gambar gagal di update', data: null });
        }

        db.query('SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?', [emailLogin], (err, results) => {
            if (err || results.length === 0) {
                return res.status(401).json({ status: 103, message: 'Profile tidak ditemukan', data: null });
            }
            return res.status(200).json({ status: 0, message: 'Sukses', data: results[0] });
        });
    });
};
