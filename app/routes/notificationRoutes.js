// routes/notification.js
// routes/deliveryRoutes.js
const express = require('express');
const { createDelivery, updateDeliveryStatus } = require('../controllers/deliveryController');
const {sendNotification} = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/', authMiddleware, sendNotification);

module.exports = router;
