// models/Automat.js
const mongoose = require('mongoose');

const automatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    location: { type: String, required: true },
    createdDate: { type: Date, default: Date.now, immutable: true }
});

module.exports = mongoose.model('Automat', automatSchema);
