const db = require('../config/db'); // Import your DB connection

// Get all banners
exports.getAllBanners = (req, res) => {
    db.query('SELECT banner_name, banner_image, description FROM banners', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ status: 103, message: 'Tidak ada data banner', data: null });
        }
        return res.status(200).json({ status: 0, message: 'Sukses', data: results });
    });
};