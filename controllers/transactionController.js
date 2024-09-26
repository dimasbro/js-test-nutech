const { validationResult } = require('express-validator');
const db = require('../config/db'); // Import your DB connection

// Function to format the invoice number as three digits
const formatInvoiceNumber = (number) => {
    return number.toString().padStart(3, '0');
};

// Get user balance
exports.getBalance = (req, res) => {
    const userId = req.userId; // Assume userId is set from JWT middleware

    db.query('SELECT balance FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Gagal mengambil saldo', data: null });
        }
        if (results.length === 0) {
            return res.status(403).json({ status: false, message: 'Balance tidak tersedia', data: null });
        }

        return res.status(200).json({ status: true, message: 'Balance berhasil didapatkan', data: { balance: results[0].balance } });
    });
};

// Top up balance
exports.topUp = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ status: false, message: errorMessages[0], data: null });
    }

    const userId = req.userId; // Assume userId is set from JWT middleware
    const { top_up_amount } = req.body;

    // Validate the top_up_amount
    if (!top_up_amount || top_up_amount <= 0) {
        return res.status(403).json({ status: false, message: 'Invalid angka, harus positif', data: null });
    }

    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    db.query('SELECT invoice_number FROM transactions WHERE DATE(created_at) = ? order by id desc limit 1', [today], (err, row) => {
        let increment = 0;
        if (err) {
            increment = formatInvoiceNumber(1);
        }
        if (row) {
            increment = formatInvoiceNumber(parseInt(row[0].invoice_number.split('-')[1])+1);
            if (increment > 999) {
                increment = increment;
            }
        }

        // Update the user's balance
        db.query('UPDATE users SET balance = balance + ? WHERE id = ?', [top_up_amount, userId], (err, results) => {
            if (err) {
                return res.status(403).json({ status: false, message: 'Gagal update balance', data: null });
            }

            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
            const year = date.getFullYear(); // Get full year

            // Record the transaction
            db.query('INSERT INTO transactions (user_id, amount, transaction_type, description, invoice_number) VALUES (?, ?, ?, ?, ?)', [userId, top_up_amount, 'TOPUP', 'Top Up balance', 'INV'+`${day}${month}${year}`+'-'+increment], (err) => {
                if (err) {
                    return res.status(403).json({ status: false, message: 'Transaksi gagal disimpan', data: null });
                }
            
                db.query('SELECT balance FROM users WHERE id = ? limit 1', [userId], (err, results) => {
                    return res.status(200).json({ status: true, message: 'Topup berhasil update', data: { balance: results[0].balance } });
                });
            });
        });
    });
};

// Post a transaction
exports.postTransaction = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return res.status(400).json({ status: false, message: errorMessages[0], data: null });
    }
    
    const userId = req.userId; // Assume userId is set from JWT middleware
    const { service_code } = req.body;

    // Check if the service exists
    db.query('SELECT * FROM services WHERE service_code = ?', [service_code], (err, serviceResults) => {
        if (err) {
            return res.status(403).json({ status: false, message: 'Service error', data: null });
        }
        if (serviceResults.length === 0) {
            return res.status(403).json({ status: false, message: 'Service tidak tersedia', data: null });
        }

        const service = serviceResults[0];

        // Check user balance
        db.query('SELECT balance FROM users WHERE id = ?', [userId], (err, balanceResults) => {
            if (err) {
                return res.status(403).json({ status: false, message: 'Balance error', data: null });
            }
            if (balanceResults.length === 0) {
                return res.status(403).json({ status: false, message: 'Balance tidak tersedia', data: null });
            }

            const userBalance = balanceResults[0].balance;

            // Validate if the user has enough balance
            if (userBalance < service.service_tarif) {
                return res.status(403).json({ status: false, message: 'Balance tidak cukup', data: null });
            }

            const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

            db.query('SELECT invoice_number FROM transactions WHERE DATE(created_at) = ? order by id desc limit 1', [today], (err, row) => {
                let increment = 0;
                if (err) {
                    increment = formatInvoiceNumber(1);
                }
                if (row) {
                    increment = formatInvoiceNumber(parseInt(row[0].invoice_number.split('-')[1])+1);
                    if (increment > 999) {
                        increment = increment;
                    }
                }

                const date = new Date();
                const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
                const year = date.getFullYear(); // Get full year

                db.query('UPDATE users SET balance = balance - ? WHERE id = ?', [service.service_tarif, userId], (err, balanceResults) => {
                    if (err) {
                        return res.status(403).json({ status: false, message: 'Balance error', data: null });
                    }
                    if (balanceResults.affectedRows === 0) {
                        return res.status(403).json({ status: false, message: 'Balance tidak tersedia', data: null });
                    }

                    // Create the transaction
                    db.query('INSERT INTO transactions (user_id, service_id, amount, transaction_type, invoice_number, description) VALUES (?, ?, ?, ?, ?, ?)', 
                        [userId, service.id, service.service_tarif, 'PAYMENT', 'INV'+`${day}${month}${year}`+'-'+increment, service.service_name], (err, transactionResults) => {
                            if (err) {
                                return res.status(403).json({ status: false, message: 'Transaksi gagal dibuat', data: null });
                            }

                            return res.status(200).json({ status: true, message: 'Sukses', data: {
                                service_code: service.service_code,
                                service_name: service.service_name,
                                service_tarif: service.service_tarif,
                            } });
                        }
                    );
                });
            });
        });
    });
};

// Get transaction history with pagination
exports.getTransactionHistory = (req, res) => {
    const userId = req.userId; // Assume userId is set from JWT middleware
    const offset = parseInt(req.query.offset) || 0; // Default to 0 if not provided
    const limit = parseInt(req.query.limit) || 1000000; // Default to 10 if not provided

    db.query(
        'SELECT invoice_number, transaction_type, description, amount, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [userId, limit, offset],
        (err, results) => {
            if (err) {
                return res.status(403).json({ status: false, message: 'Gagal dapatkan data', data: null });
            }
            return res.status(200).json({ status: true, message: 'Sukses', data: results });
        }
    );
};