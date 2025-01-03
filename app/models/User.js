// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expoPushToken: { type: String },
    createdDate: { type: Date, default: Date.now, immutable: true }
});

module.exports = mongoose.model('User', userSchema);
