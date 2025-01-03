const fetch = require("node-fetch");
const User = require('../models/user'); // Kullanıcı modelinizi buradan içe aktarın

exports.sendNotification = async (req, res) => {
    const { title, body } = req.body; // Push token, başlık ve mesajı al
    const userId = req.user.userId; // Authenticated user ID
    const automatId = req.user.automatId; // Authenticated user's automatId

    // Kullanıcının otomata göre bildirim gönderme işlemi
    if (automatId) {
        try {
            // User'ı automatId'ye göre bul
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı.' + userId, id: userId });
            }

            // Kullanıcının Expo Push Token'ını al
            const userExpoPushToken = user.expoPushToken;

            if (!userExpoPushToken) {
                return res.status(400).json({ error: 'Kullanıcının Push Token\'ı bulunamadı.' });
            }

            // Bildirim mesajı
            const message = {
                to: userExpoPushToken,
                title: title || "Bildirim Başlığı", // Başlık varsa kullan, yoksa varsayılan
                body: body || "Bildirim Mesajı", // Mesaj varsa kullan, yoksa varsayılan
            };

            // Bildirim gönderme isteği
            const response = await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });

            const responseData = await response.json();
            console.log("Notification response:", userExpoPushToken, userId, automatId);
            if (response.ok) {
            console.log("Notification ok response:", userExpoPushToken, userId, automatId);

                return res.status(200).json({
                    success: true,
                    message: "Bildirim başarıyla gönderildi.",
                    response: responseData,
                });
            } else {
                return res.status(400).json({ error: "Bildirim gönderilemedi.", details: responseData });
            }
        } catch (error) {
            console.error("Error sending notification:", error);
            return res.status(500).json({ error: "Sunucu hatası. Bildirim gönderilirken bir hata oluştu." });
        }
    } else {
        return res.status(400).json({ error: 'Otomat ID belirtilmeli.' });
    }
};
