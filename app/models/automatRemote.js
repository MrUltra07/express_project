// models/AutomatRemote.js
const mongoose = require('mongoose');

// Command için alt şema
const commandSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['OPEN_LOCK', 'OPEN_APT_DOOR', "SET_PW"], 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
});

const automatRemoteSchema = new mongoose.Schema({
    automatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Automat', required: true },
    isReaded: { type: Boolean, required: true, default: false },
    command: { 
        type: commandSchema, 
        required: true 
    },
    createdAt : { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now, immutable: true }
});

module.exports = mongoose.model('AutomatRemote', automatRemoteSchema);
