// controllers/socketController.js
const { Server } = require('socket.io');

let io; // Socket.IO sunucusu

// Socket sunucusunu başlatma
exports.initSocket = (server) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`Yeni bir kullanıcı bağlandı: ${socket.id}`);

        // Oda tanımlaması
        socket.on('registerAutomat', (automatId) => {
            socket.join(automatId); // Otomata odasına katılıyor
            console.log(`Otomata katıldı: ${automatId}`);
        });

        socket.on('registerUser', (userId) => {
            socket.join(userId); // Kullanıcı odasına katılıyor
            console.log(`Kullanıcı katıldı: ${userId}`);
        });

        // Bağlantı kesilme olayı
        socket.on('disconnect', () => {
            console.log(`Kullanıcı bağlantısını kesti: ${socket.id}`);
        });
    });
};

// Socket.IO sunucusunu dışarıya aktarma
exports.getSocketInstance = () => {
    if (!io) {
        throw new Error('Socket.IO sunucusu başlatılmamış!');
    }
    return io;
};
