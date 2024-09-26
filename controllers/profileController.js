const { validationResult } = require('express-validator');
const db = require('../config/db'); // Import your DB connection

// Get user profile
exports.getProfile = (req, res) => {
    const userId = req.userId; // User ID from the verified token

    db.query('SELECT id, email, first_name, last_name, profile_image FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({ status: false, message: 'Profile tidak ditemukan', data: null });
        }
        return res.status(200).json({ status: true, message: 'Profile berhasil didapatkan', data: results[0] });
    });
};

// Update user profile
exports.updateProfile = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ status: false, message: errorMessages[0], data: null });
    }
    
    const userId = req.userId; // User ID from the verified token
    const { first_name, last_name } = req.body; // Assume we only allow updating

    db.query('UPDATE users SET first_name = ?, last_name = ? WHERE id = ?', [first_name, last_name, userId], (err, results) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Profile gagal di update', data: null });
        }

        return res.status(200).json({ status: true, message: 'Profile berhasil di update', data: results[0] });
    });
};

exports.updateUserProfileImage = (req, res) => {
    const userId = req.userId; // Assume userId is set from JWT middleware

    if (!req.file) {
        return res.status(403).json({ status: false, message: 'Tidak ada file upload', data: null });
    }

    const profileImagePath = req.file.path.replace(/\\/g, '/');; // Get the path of the uploaded file

    // Update the user's profile image in the database
    db.query('UPDATE users SET profile_image = ? WHERE id = ?', [req.protocol + '://' + req.get('host')+'/'+profileImagePath, userId], (err, results) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Profile gagal di update', data: null });
        }

        return res.status(200).json({ status: true, message: 'Profile berhasil di update', data: results[0] });
    });
};
