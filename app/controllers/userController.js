// controllers/authController.js
const User = require('../models/user');

// Kullanıcıyı güncelleme ve token'ı kaydetme
exports.updateUser = async (req, res) => {
    const { userId, expoPushToken } = req.body; // Sadece token'ı al

    try {
        // Kullanıcıyı bul
        let user = await User.findOne({ _id:userId });
        
        // Kullanıcı yoksa 404 hatası döndür
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Sadece Expo Push Token'ı güncelle
        user.expoPushToken = expoPushToken; // Token'ı güncelle
        await user.save();
        console.log('User updated successfully', expoPushToken);
        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
