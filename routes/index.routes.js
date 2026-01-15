const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/config');
const File = require('../models/file.model');
const Folder = require('../models/folder.model');
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

// Configure Multer for memory storage (files are held in RAM then sent to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/home', authenticateToken, async (req, res) => {
    try {
        const currentFolderId = req.query.folderId || null;

        // Fetch files in current folder
        const files = await File.find({
            uploadedBy: req.user.userId,
            folder: currentFolderId
        }).sort({ uploadedAt: -1 });

        // Fetch folders in current folder
        const folders = await Folder.find({
            uploadedBy: req.user.userId,
            parentFolder: currentFolderId
        }).sort({ createdAt: -1 });

        // Build breadcrumb path
        const breadcrumbs = [];
        let currentFolder = currentFolderId ? await Folder.findById(currentFolderId) : null;

        while (currentFolder) {
            breadcrumbs.unshift({ _id: currentFolder._id, name: currentFolder.name });
            currentFolder = currentFolder.parentFolder ? await Folder.findById(currentFolder.parentFolder) : null;
        }

        const uploadStatus = req.query.upload;
        const deleteStatus = req.query.delete;
        const error = req.query.error;

        res.render('home', {
            files,
            folders,
            breadcrumbs,
            currentFolderId,
            uploadStatus,
            deleteStatus,
            error
        });
    } catch (error) {
        console.error('Home route error:', error);
        res.render('home', {
            files: [],
            folders: [],
            breadcrumbs: [],
            currentFolderId: null,
            uploadStatus: null,
            deleteStatus: null,
            error: null
        });
    }
});

// Create folder route
router.post('/folder/create', authenticateToken, async (req, res) => {
    try {
        const { name, parentFolderId } = req.body;
        const folderId = req.query.folderId || null;

        if (!name || name.trim() === '') {
            return res.redirect(`/home${folderId ? '?folderId=' + folderId : ''}`);
        }

        const newFolder = new Folder({
            name: name.trim(),
            uploadedBy: req.user.userId,
            parentFolder: parentFolderId || null
        });

        await newFolder.save();
        return res.redirect(`/home${folderId ? '?folderId=' + folderId : ''}`);
    } catch (error) {
        console.error('Folder creation error:', error);
        return res.redirect('/home');
    }
});

// Delete folder route
router.post('/folder/delete/:id', authenticateToken, async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);

        if (!folder || folder.uploadedBy.toString() !== req.user.userId) {
            return res.redirect('/home?delete=failed&error=Folder%20not%20found');
        }

        const parentFolderId = folder.parentFolder; // Preserve parent folder context

        // Recursively delete all files in this folder and subfolders
        async function deleteFolder(folderId) {
            // Delete all files in this folder
            const files = await File.find({ folder: folderId });
            for (const file of files) {
                try {
                    if (file.publicId) {
                        await cloudinary.uploader.destroy(file.publicId);
                    }
                } catch (err) {
                    console.error('Cloudinary delete error:', err);
                }
                await File.findByIdAndDelete(file._id);
            }

            // Find and delete all subfolders
            const subfolders = await Folder.find({ parentFolder: folderId });
            for (const subfolder of subfolders) {
                await deleteFolder(subfolder._id);
            }

            // Delete the folder itself
            await Folder.findByIdAndDelete(folderId);
        }

        await deleteFolder(req.params.id);

        const redirectUrl = parentFolderId ? `/home?folderId=${parentFolderId}&delete=success` : '/home?delete=success';
        return res.redirect(redirectUrl);
    } catch (error) {
        console.error('Folder deletion error:', error);
        return res.redirect('/home?delete=failed&error=' + encodeURIComponent(error.message));
    }
});

// Upload file route
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.redirect('/home?upload=failed&error=No%20file%20selected');
        }

        const folderId = req.body.folderId || null;
        console.log('Uploading file to Cloudinary:', req.file.originalname);

        // Upload to Cloudinary using stream
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
            uploadedBy: req.user.userId,
            folder: folderId
        });

        await newFile.save();
        console.log('File saved to MongoDB:', newFile._id);

        // Redirect back to home with success message
        const redirectUrl = folderId ? `/home?folderId=${folderId}&upload=success` : '/home?upload=success';
        return res.redirect(redirectUrl);
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

// Fallback POST route for deletion (bypass method-override)
router.post('/files/delete/:id', authenticateToken, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file || file.uploadedBy.toString() !== req.user.userId) {
            return res.redirect('/home?delete=failed&error=File%20not%20found');
        }

        const folderId = file.folder; // Preserve folder context

        // Delete from Cloudinary
        try {
            if (file.publicId) {
                await cloudinary.uploader.destroy(file.publicId);
            }
        } catch (err) {
            console.error('Cloudinary delete error:', err);
        }

        // Delete from MongoDB
        await File.findByIdAndDelete(req.params.id);

        const redirectUrl = folderId ? `/home?folderId=${folderId}&delete=success` : '/home?delete=success';
        return res.redirect(redirectUrl);
    } catch (error) {
        console.error('Delete error:', error);
        return res.redirect('/home?delete=failed&error=' + encodeURIComponent(error.message));
    }
});

// Delete file (Keep existing just in case, but cleaned up logs)
router.delete('/files/:id', authenticateToken, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file || file.uploadedBy.toString() !== req.user.userId) {
            return res.redirect('/home?delete=failed');
        }

        const folderId = file.folder; // Preserve folder context

        try {
            if (file.publicId) await cloudinary.uploader.destroy(file.publicId);
        } catch (e) { }

        await File.findByIdAndDelete(req.params.id);

        const redirectUrl = folderId ? `/home?folderId=${folderId}&delete=success` : '/home?delete=success';
        return res.redirect(redirectUrl);
    } catch (error) {
        return res.redirect('/home?delete=failed');
    }
});

module.exports = router;