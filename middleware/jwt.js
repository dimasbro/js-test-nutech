// jwt.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (emailLogin) => {
    return jwt.sign({ email: emailLogin }, process.env.JWT_SECRET, {
        expiresIn: '12h', // Token expiration time
    });
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(401).json({ status: 108, message: 'Token harus di isi', data: null });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
        }
        req.emailLogin = decoded.email; // Store user ID in request for future use
        next();
    });
};

module.exports = { generateToken, verifyToken };
