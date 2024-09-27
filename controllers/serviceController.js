const db = require('../config/db'); // Import your DB connection

// Get all services
exports.getAllServices = (req, res) => {
    db.query('SELECT service_code, service_name, service_icon, service_tarif FROM services', (err, results) => {
        if (err) {
            return res.status(401).json({ status: 103, message: 'Tidak ada data service', data: null });
        }
        return res.status(200).json({ status: 0, message: 'Sukses', data: results });
    });
};
