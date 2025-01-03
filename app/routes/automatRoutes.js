// routes/automatRoutes.js
const express = require('express');
const { addAutomat, getAutomats, deleteAutomat,getAutomatsByUrlId } = require('../controllers/automatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addAutomat);
router.get('/', authMiddleware, getAutomats);
router.delete('/:automatId', authMiddleware, deleteAutomat);
router.get('/:id', authMiddleware, getAutomatsByUrlId);

module.exports = router;
