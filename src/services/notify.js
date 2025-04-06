const Notification = require('../models/Notification');

const sendNotification = async ({ recipient, type, message, link }) => {
  try {
    await Notification.create({ recipient, type, message, link });
  } catch (err) {
    console.error('Error enviando notificación:', err);
  }
};

module.exports = sendNotification;
