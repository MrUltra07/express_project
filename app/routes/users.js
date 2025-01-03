// routes/authRoutes.js
const express = require('express');
const { updateUser} = require('../controllers/userController');

const router = express.Router();

router.put('/updateToken', updateUser);

module.exports = router;
