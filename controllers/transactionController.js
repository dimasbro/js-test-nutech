const { validationResult } = require('express-validator');
const db = require('../config/db'); // Import your DB connection

// Function to format the invoice number as three digits
const formatInvoiceNumber = (number) => {
    return number.toString().padStart(3, '0');
};

// Get user balance
exports.getBalance = (req, res) => {
    const emailLogin = req.emailLogin; // Email login from the verified token

    db.query('SELECT balance FROM users WHERE email = ?', [emailLogin], (err, results) => {
        if (err) {
            return res.status(401).json({ status: 103, message: 'Gagal mengambil saldo', data: null });
        }

        return res.status(200).json({ status: 0, message: 'Sukses', data: { balance: results[0].balance } });
    });
};

// Top up balance
exports.topUp = (req, res) => {
    const emailLogin = req.emailLogin; // Email login from the verified token
    db.query('SELECT id FROM users WHERE email = ?', [emailLogin], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ status: 103, message: 'Authentication tidak ditemukan', data: null });
        }

        const userId = results[0].id;
        const { top_up_amount } = req.body;

        // Validate the top_up_amount
        if (! parseInt(top_up_amount) || top_up_amount <= 0) {
            return res.status(400).json({ status: 102, message: 'Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0', data: null });
        }

        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        db.query('SELECT invoice_number FROM transactions WHERE DATE(created_at) = ? order by id desc limit 1', [today], (err, row) => {
            let increment = formatInvoiceNumber(1);
            if (err || row.length === 0) {
                increment = formatInvoiceNumber(1);
            }
            if (row.length > 0) {
                increment = formatInvoiceNumber(parseInt(row[0].invoice_number.split('-')[1])+1);
                if (increment > 999) {
                    increment = increment;
                }
            }

            // Update the user's balance
            db.query('UPDATE users SET balance = balance + ? WHERE id = ?', [top_up_amount, userId], (err, results) => {
                if (err) {
                    return res.status(401).json({ status: 103, message: 'Gagal update balance', data: null });
                }

                const date = new Date();
                const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
                const year = date.getFullYear(); // Get full year

                // Record the transaction
                db.query('INSERT INTO transactions (user_id, amount, transaction_type, description, invoice_number) VALUES (?, ?, ?, ?, ?)', [userId, top_up_amount, 'TOPUP', 'Top Up balance', 'INV'+`${day}${month}${year}`+'-'+increment], (err) => {
                    if (err) {
                        return res.status(401).json({ status: 103, message: 'Transaksi gagal disimpan', data: null });
                    }
                
                    db.query('SELECT balance FROM users WHERE id = ? limit 1', [userId], (err, results) => {
                        if (err || results.length === 0) {
                            return res.status(401).json({ status: 103, message: 'Balance user tidak di temukan', data: null });
                        }
                        return res.status(200).json({ status: 0, message: 'Top Up Balance berhasil', data: { balance: results[0].balance } });
                    });
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
        return res.status(400).json({ status: 102, message: errorMessages[0], data: null });
    }
    
    const emailLogin = req.emailLogin; // Email login from the verified token
    db.query('SELECT id FROM users WHERE email = ?', [emailLogin], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ status: 103, message: 'Authentication tidak ditemukan', data: null });
        }

        const userId = results[0].id;
        const { service_code } = req.body;

        // Check if the service exists
        db.query('SELECT * FROM services WHERE service_code = ?', [service_code], (err, serviceResults) => {
            if (err) {
                return res.status(400).json({ status: 102, message: 'service atau Layanan error', data: null });
            }
            if (serviceResults.length === 0) {
                return res.status(400).json({ status: 102, message: 'Service atau Layanan tidak ditemukan', data: null });
            }

            const service = serviceResults[0];

            // Check user balance
            db.query('SELECT balance FROM users WHERE id = ?', [userId], (err, balanceResults) => {
                if (err) {
                    return res.status(401).json({ status: 103, message: 'Balance error', data: null });
                }
                if (balanceResults.length === 0) {
                    return res.status(401).json({ status: 103, message: 'Balance tidak tersedia', data: null });
                }

                const userBalance = balanceResults[0].balance;

                // Validate if the user has enough balance
                if (parseInt(userBalance) < parseInt(service.service_tarif)) {
                    return res.status(401).json({ status: 103, message: 'Saldo tidak mencukupi', data: null });
                }

                const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

                db.query('SELECT invoice_number FROM transactions WHERE DATE(created_at) = ? order by id desc limit 1', [today], (err, row) => {
                    let increment = formatInvoiceNumber(1);
                    if (err || row.length === 0) {
                        increment = formatInvoiceNumber(1);
                    }
                    if (row.length > 0) {
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
                            return res.status(401).json({ status: 103, message: 'Balance error', data: null });
                        }

                        // Create the transaction
                        db.query('INSERT INTO transactions (user_id, service_id, amount, transaction_type, invoice_number, description) VALUES (?, ?, ?, ?, ?, ?)', 
                            [userId, service.id, service.service_tarif, 'PAYMENT', 'INV'+`${day}${month}${year}`+'-'+increment, service.service_name], (err, transactionResults) => {
                                if (err) {
                                    return res.status(401).json({ status: 103, message: 'Transaksi gagal dibuat', data: null });
                                }
                                db.query('SELECT invoice_number, transaction_type, created_at FROM transactions WHERE id = ?', [transactionResults.insertId], (err, getTransaction) => {
                                    if (err) {
                                        return res.status(401).json({ status: 103, message: 'Gagal dapatkan data transaksi', data: null });
                                    }
                                    return res.status(200).json({ status: 0, message: 'Transaksi berhasil', data: {
                                        invoice_number: getTransaction[0].invoice_number,
                                        service_code: service.service_code,
                                        service_name: service.service_name,
                                        transaction_type: getTransaction[0].transaction_type,
                                        total_amount: service.service_tarif,
                                        created_on: getTransaction[0].created_at
                                    } });
                                });
                            }
                        );
                    });
                });
            });
        });
    });
};

// Get transaction history with pagination
exports.getTransactionHistory = (req, res) => {
    const emailLogin = req.emailLogin; // Email login from the verified token
    db.query('SELECT id FROM users WHERE email = ?', [emailLogin], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ status: 103, message: 'Authentication tidak ditemukan', data: null });
        }

        const userId = results[0].id;
        const offset = parseInt(req.query.offset) || 0; // Default to 0 if not provided
        const limit = parseInt(req.query.limit) || 5; // Default to 3 if not provided

        db.query(
            'SELECT invoice_number, transaction_type, description, amount, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [userId, limit, offset],
            (err, results) => {
                if (err) {
                    return res.status(401).json({ status: 103, message: 'Gagal mendapatkan data history', data: null });
                }
                return res.status(200).json({ status: 0, message: 'Get History Berhasil', data: {offset: offset, limit: limit, records: results }});
            }
        );
    });
};