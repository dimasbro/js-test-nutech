const db = require('../config/db'); // Import your DB connection

// Get all services
exports.getAllServices = (req, res) => {
    db.query('SELECT service_code, service_name, service_icon, service_tarif FROM services', (err, results) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Service tidak ditemukan', data: null });
        }
        return res.status(200).json({ status: true, message: 'Service berhasil didapatkan', data: results });
    });
};
