// controllers/automatController.js
const Automat = require('../models/automat');
const jwt = require('jsonwebtoken');

// Otomat ekleme
// Otomat ekleme
exports.addAutomat = async (req, res) => {
    const { location, name } = req.body; // 'location' ve 'name' alanlarını alıyoruz

    // Kullanıcı kimliğini al (req.user'dan)
    const userId = req.user.id;

    // Benzersiz otomata kontrolü (aynı kullanıcı ve aynı isim ile otomata yoksa ekle)
    const existingAutomat = await Automat.findOne({ userId, name });
    if (existingAutomat) {
        return res.status(400).json({ error: 'Bu kullanıcı için aynı isimde bir otomata zaten var.' });
    }

    // Yeni automat nesnesini oluştur
    const automat = new Automat({ userId, location, name });

    try {
        // Automat kaydını veritabanına kaydet
        const savedAutomat = await automat.save();

        // JWT token oluştur (automatId ve userId ile)
        const automatToken = jwt.sign(
            { userId, automatId: savedAutomat._id }, // Token içeriği
            process.env.JWT_SECRET, // Gizli anahtar
            { expiresIn: '1y' } // Tokenın süresi 1 yıl
        );

        // Token'ı ve automat nesnesinin id'sini döndür
        res.status(201).json({ token:automatToken, _id: savedAutomat._id, name:savedAutomat.name, location: savedAutomat.location });
    } catch (error) {
        console.error(error); // Hata detaylarını konsola yaz
        res.status(500).json({ error: 'Otomat eklenirken bir hata oluştu.', details: error.message }); // Hata mesajını döndür
    }
};

// Kullanıcıya ait otomataları getirme
exports.getAutomats = async (req, res) => {
    const userId = req.user.id; // Kullanıcı kimliğini al

    try {
        // Kullanıcıya ait tüm otomataları bul
        const automats = await Automat.find({ userId });

        // Otomataları döndür
        res.status(200).json(automats);
    } catch (error) {
        res.status(500).json({ error: 'Otomatlar alınırken bir hata oluştu.' });
    }
};
exports.getAutomatsByUrlId = async (req, res) => {
    const _id = req.params.id; // URL'den kullanıcı kimliğini al

    try {
        // Kullanıcıya ait tüm otomataları bul
        const automat = await Automat.findOne({ _id });
        console.log(automat, "automat", _id);
        // Otomataları döndür
        res.status(200).json(automat);
    } catch (error) {
        res.status(500).json({ error: 'Otomatlar alınırken bir hata oluştu.' });
    }
};

// Otomat silme
exports.deleteAutomat = async (req, res) => {
    const userId = req.user.id; // Token'den gelen kullanıcı kimliği
    const { automatId } = req.params; // Parametre olarak gelen automat ID

    try {
        // Kullanıcıya ait olan ve belirtilen ID'ye sahip otomatı bul
        console.log(automatId, userId);
        const automat = await Automat.findOne({ _id: automatId, userId });

        if (!automat) {
            return res.status(404).json({ error: 'Otomat bulunamadı veya bu otomat size ait değil.' });
        }

        // Otomatı sil
        await Automat.deleteOne({ _id: automatId });

        // Başarılı yanıt döndür
        res.status(200).json({ message: 'Otomat başarıyla silindi.' });
    } catch (error) {
        console.error(error); // Hata detaylarını konsola yaz
        res.status(500).json({ error: 'Otomat silinirken bir hata oluştu.', details: error.message }); // Hata mesajını döndür
    }
};
