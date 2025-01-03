const express = require('express');
const router = express.Router();
const bigDataService = require('../services/bigDataService');

// GET endpoint: İşlem türü, başlangıç ve bitiş tarihine göre işlemleri döndürür
router.get('/big-data', async (req, res) => {
    try {
        const { islemTuru, baslangicTarihi, bitisTarihi } = req.query;

        const data = await bigDataService.getBigData({
            islemTuru,
            baslangicTarihi,
            bitisTarihi
        });

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Bir hata oluştu' });
    }
});

module.exports = router;
