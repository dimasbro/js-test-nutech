const db = require('../config/db'); // Import your DB connection

// Get all banners
exports.getAllBanners = (req, res) => {
    db.query('SELECT banner_name, banner_image, description FROM banners', (err, results) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Banner tidak ditemukan', data: null });
        }
        return res.status(200).json({ status: true, message: 'Banner berhasil didapatkan', data: results });
    });
};