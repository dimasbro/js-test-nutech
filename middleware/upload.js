// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Specify your uploads folder
    filename: (req, file, cb) => {
        // Use original file name or generate a unique one
        cb(null, Date.now() + path.extname(file.originalname)); // Append the timestamp to avoid duplicates
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        // Check file type
        const filetypes = /jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('file'); // Expecting a field named file

module.exports = upload;
