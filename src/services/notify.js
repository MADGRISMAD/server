const Notification = require('../models/Notification');

const sendNotification = async ({ recipient, type, message, link }, io) => {
  try {
    const notification = await Notification.create({ recipient, type, message, link });
    
    // Emitir la notificación en tiempo real si io está disponible
    if (io) {
      io.to(recipient.toString()).emit('notification', notification);
    }
    
    return notification;
  } catch (err) {
    console.error('Error enviando notificación:', err);
    throw err;
  }
};

module.exports = sendNotification;
