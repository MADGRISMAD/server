const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const Notification = require('../models/Notification');

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Gestión de notificaciones para los usuarios
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Obtener todas las notificaciones del usuario autenticado
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/', protect, async (req, res) => {
    const notifs = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    res.json(notifs);
  });
  
  /**
   * @swagger
   * /notifications/{id}/read:
   *   put:
   *     summary: Marcar una notificación como leída
   *     tags: [Notificaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID de la notificación
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Notificación marcada como leída
   *       401:
   *         description: No autorizado
   *       404:
   *         description: Notificación no encontrada
   */
  router.put('/:id/read', protect, async (req, res) => {
    await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { read: true });
    res.json({ message: 'Notificación marcada como leída' });
  });
  
  /**
   * @swagger
   * /notifications/mark-all:
   *   put:
   *     summary: Marcar todas las notificaciones del usuario como leídas
   *     tags: [Notificaciones]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Todas las notificaciones marcadas como leídas
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
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

