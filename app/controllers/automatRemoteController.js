const AutomatRemote = require('../models/automatRemote');
const Automat = require('../models/automat');
const jwt = require('jsonwebtoken');

// POST: Otomata komut gönderme (sadece kullanıcı kendi otomatına erişebilir)
exports.sendCommandToAutomat = async (req, res) => {
    const { command, automatId } = req.body; // Gönderilen komut
    const userId = req.user.id; // JWT'den gelen kullanıcı ID'si

    try {
        // Kullanıcının kendi otomatını kontrol etme
        const automat = await Automat.findOne({ _id: automatId, userId });
        if (!automat) {
            return res.status(403).json({ error: 'Bu otomat size ait değil.' });
        }

        // Komutu kaydetme
        const automatRemote = new AutomatRemote({
            automatId,
            command,
            isReaded: false,
            createdAt: new Date(),
        });
        await automatRemote.save();

        res.status(201).json({ message: 'Komut başarıyla gönderildi.', automatRemote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Komut gönderilirken bir hata oluştu.' + error});
    }
};

// GET: Otomatın okunmamış komutlarını alma (sadece otomat token ile erişilir)
exports.getUnreadCommandsForAutomat = async (req, res) => {
    const automatId = req.user.automatId; // Middleware'den gelen automatId

    try {
        // Otomata ait okunmamış komutları al
        const unreadCommands = await AutomatRemote.find({
            automatId,
            isReaded: false,
        });

        // Komutları döndür
        res.status(200).json(unreadCommands);

        // Komutları okundu olarak işaretle
        await AutomatRemote.updateMany(
            { automatId, isReaded: false },
            { isReaded: true }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Komutlar alınırken bir hata oluştu.' });
    }
};
