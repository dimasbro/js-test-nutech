// jwt.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
    });
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(403).json({ status: false, message: 'Token wajib diisi', data: null });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Token tidak valid', data: null });
        }
        req.userId = decoded.id; // Store user ID in request for future use
        next();
    });
};

module.exports = { generateToken, verifyToken };
