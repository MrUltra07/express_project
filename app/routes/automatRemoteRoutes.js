// routes/commandRoutes.js
const express = require('express');
const { sendCommandToAutomat, getUnreadCommandsForAutomat } = require('../controllers/automatRemoteController'); // Controller fonksiyonları
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware

const router = express.Router();

// Yeni komut ekleme
router.post('/', authMiddleware, sendCommandToAutomat);

// Otomata ait okunmamış komutları getirme
router.get('/unread', authMiddleware, getUnreadCommandsForAutomat);

module.exports = router;
