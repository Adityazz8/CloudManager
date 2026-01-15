const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }, // Cloudinary URL
    publicId: { type: String, required: true }, // Cloudinary public ID for deletion
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    uploadedAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);
module.exports = File;