const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./app/routes/authRoutes');
const automatRoutes = require('./app/routes/automatRoutes');
const deliveryRoutes = require('./app/routes/deliveryRoutes');
const userRoutes = require('./app/routes/userRoutes');
const notificationRoutes = require('./app/routes/notificationRoutes');
const automatControlRoutes = require('./app/routes/automatRemoteRoutes');
const bigDataController = require('./app/controllers/bigDatacontroller');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// .env dosyasını yükle
require('dotenv').config();
connectDB();

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/automats', automatRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/users', userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/commands", automatControlRoutes);
app.use("/api",bigDataController);
// Socket.IO sunucusunu kontrolcüye geçir

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
