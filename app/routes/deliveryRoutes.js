 
// routes/deliveryRoutes.js
const express = require('express');
const { createDelivery, updateDeliveryStatus, getDeliveryById, getDeliveryByDeliveryNo, updateAllDeliveriesAtAutomat, getDeliveries } = require('../controllers/deliveryController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/', authMiddleware, createDelivery);
router.get('/', authMiddleware, getDeliveries);
router.put('/:deliveryId', authMiddleware, updateDeliveryStatus);
router.put('/all', authMiddleware, updateAllDeliveriesAtAutomat);
router.get('/:deliveryId', authMiddleware, getDeliveryById);
router.get('/getByNo/:deliveryNo', authMiddleware, getDeliveryByDeliveryNo);

module.exports = router;
