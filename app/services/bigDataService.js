const User = require('../models/user');
const Automat = require('../models/automat');
const AutomatRemote = require('../models/automatRemote');
const Delivery = require('../models/delivery');
const Notification = require('../models/notification');

async function getBigData({ islemTuru, baslangicTarihi, bitisTarihi }) {
    const filters = {};

    // Tarih aralığı kontrolü
    if (baslangicTarihi && bitisTarihi) {
        filters.createdDate = { $gte: new Date(baslangicTarihi), $lte: new Date(bitisTarihi) };
    }

    let results = [];

    if (!islemTuru || islemTuru === 'kullanici-olusturma') {
        const users = await User.find(filters);
        results.push({ islemTuru: 'kullanici-olusturma', size: users.length, data: users });
    }

    if (!islemTuru || islemTuru === 'otomatik-islem') {
        const automats = await Automat.find(filters);
        results.push({ islemTuru: 'otomatik-islem', size: automats.length, data: automats });
    }

    if (!islemTuru || islemTuru === 'uzaktan-islem') {
        const automatRemotes = await AutomatRemote.find(filters);
        results.push({ islemTuru: 'uzaktan-islem', size: automatRemotes.length, data: automatRemotes });
    }

    if (!islemTuru || islemTuru === 'kargo-islem') {
        const deliveries = await Delivery.find(filters);
        results.push({ islemTuru: 'kargo-islem', size: deliveries.length, data: deliveries });
    }

    if (!islemTuru || islemTuru === 'bildirim') {
        const notifications = await Notification.find(filters);
        results.push({ islemTuru: 'bildirim', size: notifications.length, data: notifications });
    }

    return results;
}

module.exports = { getBigData };
