const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/config');
const File = require('../models/file.model');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/user/login');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/user/login');
        req.user = user;
        next();
    });
};

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/home', authenticateToken, async (req, res) => {
    try {
        const files = await File.find({ uploadedBy: req.user.userId });
        const uploadStatus = req.query.upload;
        const deleteStatus = req.query.delete;
        const error = req.query.error;
        res.render('home', { files, uploadStatus, deleteStatus, error });
    } catch (error) {
        res.render('home', { files: [], uploadStatus: null, deleteStatus: null, error: null });
    }
});

// Upload file route
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.redirect('/home?upload=failed&error=No%20file%20selected');
        }

        console.log('Uploading file:', req.file.originalname);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary error:', error);
                        reject(error);
                    }
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        console.log('Cloudinary upload successful:', result.public_id);

        // Save file metadata to MongoDB
        const newFile = new File({
            filename: req.file.originalname,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: result.secure_url,
            publicId: result.public_id,
            uploadedBy: req.user.userId
        });

        await newFile.save();
        console.log('File saved to MongoDB:', newFile._id);

        // Redirect back to home with success message
        return res.redirect('/home?upload=success');
    } catch (error) {
        console.error('Upload error:', error.message);
        return res.redirect('/home?upload=failed&error=' + encodeURIComponent(error.message));
    }
});

// Get user's files
router.get('/files', authenticateToken, async (req, res) => {
    try {
        const files = await File.find({ uploadedBy: req.user.userId });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch files' });
    }
});

// Delete file
router.delete('/files/:id', authenticateToken, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file || file.uploadedBy.toString() !== req.user.userId) {
            return res.redirect('/home?delete=failed&error=File%20not%20found');
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.publicId);

        // Delete from MongoDB
        await File.findByIdAndDelete(req.params.id);

        // Redirect with success message
        return res.redirect('/home?delete=success');
    } catch (error) {
        console.error('Delete error:', error.message);
        return res.redirect('/home?delete=failed&error=' + encodeURIComponent(error.message));
    }
});

module.exports = router;