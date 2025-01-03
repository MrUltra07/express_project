// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    automatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Automat' },
    orderNo: { type: String, required: false },
    deliveryNo: { type: String, required: true },
    status: { type: String, default: 'Kargo oluşturuldu' },
    courierInfo: { type: String, required: true },
    address: { type: String, required: false },
    createdDate: { type: Date, default: Date.now, immutable: true }
});

module.exports = mongoose.model('Delivery', deliverySchema);
