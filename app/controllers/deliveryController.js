// controllers/deliveryController.js
const Delivery = require('../models/delivery');

// Teslimat statüleri
const deliveryStatuses = {
    CREATED: { code: 'CREATED', description: 'Delivery created' },
    IN_PROGRESS: { code: 'IN_PROGRESS', description: 'Delivery in progress' },
    AT_AUTOMAT: { code: 'AT_AUTOMAT', description: 'Delivery at automat' },
    PICKED_UP: { code: 'PICKED_UP', description: 'Picked up from automat' },
};

exports.createDelivery = async (req, res) => {
    const { deliveryNo, courierInfo, address, automatId } = req.body;

    // Yeni teslimat nesnesi oluştur
    const delivery = new Delivery({
        userId: req.user.id, // Kullanıcının ID'si
        automatId, // Body'den alınan otomata ID'si
        deliveryNo,
        courierInfo,
        address,
        status: deliveryStatuses.CREATED.code, // Başlangıç durumu
    });

    try {
        await delivery.save();
        console.log(delivery, "eklendi");
        res.status(201).json({ 
            ...delivery.toObject(), 
            statusDescription: deliveryStatuses.CREATED.description 
        });

    } catch (error) {
        res.status(500).json({ error: 'Teslimat oluşturulurken bir hata oluştu:' + error });
    }
};


exports.updateDeliveryStatus = async (req, res) => {
    const { deliveryId } = req.params; // URL'den deliveryId al
    const { status, orderNo } = req.body; // Güncellenmek istenen statü ve deliveryNo
    console.log("status", orderNo);
    try {
        const delivery = await Delivery.findById(deliveryId);

        // Kullanıcı, teslimatın sahibi mi?
        if (!delivery) {
            return res.status(404).json({ error: 'Teslimat bulunamadı.' });
        }

        const userId = req.user.id;
        const automatId = req.user.automatId;

        // Eğer güncellenmek istenen statü "AT_AUTOMAT" ise
        if (status === deliveryStatuses.AT_AUTOMAT.code) {
            // Kullanıcı kendi teslimatını güncelleyemez
            if (delivery.userId.toString() === userId) {
                return res.status(403).json({ error: 'Kullanıcı otomata ait bir teslimatı güncelleyemez.' });
            }

            // Eğer otomata ait teslimat güncelleniyorsa
            if (delivery.automatId.toString() !== automatId) {
                console.log(delivery.automatId, automatId);
                return res.status(403).json({ error: 'Bu teslimat bu otomata ait değil.' });
            }
        } else {
            // Kullanıcı kendi teslimatını güncelleyebilir
            if (delivery.userId.toString() !== userId) {
                return res.status(403).json({ error: 'Bu teslimatın sahibi değilsiniz.' });
            }
        }

        // Eğer durum IN_PROGRESS olarak güncelleniyorsa, deliveryNo boş olamaz
        if (status === 'IN_PROGRESS' && !orderNo) {
            return res.status(400).json({ error: 'Delivery No is required when status is IN_PROGRESS.' });
        }

        // Teslimatın durumunu güncelle
        delivery.status = status;

        // Eğer deliveryNo mevcutsa, teslimata ekle
        if (orderNo) {
            delivery.orderNo = orderNo; // deliveryNo'yu güncelle
        }

        // Teslimat güncellemelerini kaydet
        await delivery.save();
        res.json(
            delivery 
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Teslimat durumu güncellenirken bir hata oluştu.' });
    }
};


// Tüm teslimatları güncelle
exports.updateAllDeliveriesAtAutomat = async (req, res) => {
    // Kullanıcıdan gelen JWT'deki otomata ID'sini al
    const automatId = req.user.automatId;

    try {
        // Kullanıcının ait olduğu otomata ait tüm teslimatları bul
        const deliveries = await Delivery.find({ automatId, status: deliveryStatuses.AT_AUTOMAT.code });

        if (deliveries.length === 0) {
            return res.status(404).json({ message: 'Bu otomatta güncellenecek teslimat yok.' });
        }

        // Her bir teslimat için durumu güncelle
        for (let delivery of deliveries) {
            delivery.status = deliveryStatuses.PICKED_UP.code; // Kargo alındı
            await delivery.save();
        }

        res.json({ message: 'Tüm teslimatlar başarıyla güncellendi.', deliveries });
    } catch (error) {
        res.status(500).json({ error: 'Teslimat güncellenirken bir hata oluştu.' });
    }
};

exports.getDeliveryByDeliveryNo = async (req, res) => {
    const deliveryNo = req.params.deliveryNo; // URL'den deliveryNo al
    const automatId = req.user.automatId; // JWT'den gelen otomata ID'si
    if (!deliveryNo) {
        return res.status(400).json({ error: 'Delivery No is required.' });
    }
    if (!automatId) {
        return res.status(403).json({ error: 'You are not automat' });
    }

    try {
        // Teslimatı deliveryNo'ya göre bul
        const delivery = await Delivery.findOne({ deliveryNo });
        if(!delivery) {
            return res.status(404).json({ error: 'Delivery not found.' });
        }
        if (delivery.automatId.toString() !== automatId) {
            return res.status(403).json({ error: 'This delivery is not belong to your automat.' });
        }
        console.log("delivery cagrildi no :", deliveryNo, "delivery:", delivery);
        return res.json({orderNo:delivery.orderNo});
    } catch (error) {
        res.status(500).json({ error: 'Teslimat alınırken bir hata oluştu :' , error}); 
    }
}

exports.getDeliveryById = async (req, res) => {
    const deliveryId = req.params.deliveryId; // URL'den deliveryId al
    const userId = req.user.id; // JWT'den gelen kullanıcı ID'si
    try {
        // Teslimatı deliveryId'ye göre bul
        const delivery = await Delivery.findById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: 'Teslimat bulunamadı.' });
        }
        // Kullanıcı, teslimatın sahibi mi?
        if (delivery.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Bu teslimatın sahibi değilsiniz.' });
        }
        return res.json(delivery);
    } catch (error) {
        res.status(500).json({ error: 'Teslimat alınırken bir hata oluştu.:'. error });
    }

}

// Teslimatları getir
exports.getDeliveries = async (req, res) => {
    const userId = req.user.id; // JWT'den gelen kullanıcı ID'si
    try {
        // Kullanıcıya ait tüm teslimatları bul
        const deliveries = await Delivery.find({ userId });
        res.json(deliveries);
        console.log("deliverydondrudulud")
    } catch (error) {
        res.status(500).json({ error: 'Teslimatlar alınırken bir hata oluştu.' });
    }
};