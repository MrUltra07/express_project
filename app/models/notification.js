// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    automatId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now, immutable: true }
});

module.exports = mongoose.model('Notification', notificationSchema);
