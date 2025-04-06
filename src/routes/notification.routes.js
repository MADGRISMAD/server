const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const Notification = require('../models/Notification');

router.get('/', protect, async (req, res) => {
  const notifs = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
  res.json(notifs);
});

router.put('/:id/read', protect, async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { read: true });
  res.json({ message: 'Notificación marcada como leída' });
});

router.put('/mark-all', protect, async (req, res) => {
    try {
      await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
      res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al marcar todas las notificaciones' });
    }
  });
  

module.exports = router;
