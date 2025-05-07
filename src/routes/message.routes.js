const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/messages:
 *   post:
 *     tags: [Mensajes]
 *     summary: Enviar un mensaje
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - content
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID del destinatario
 *               content:
 *                 type: string
 *                 description: Contenido del mensaje
 *               jobId:
 *                 type: string
 *                 description: ID del trabajo relacionado (opcional)
 *     responses:
 *       201:
 *         description: Mensaje enviado exitosamente
 *       404:
 *         description: Destinatario o trabajo no encontrado
 */
router.post('/', authenticate, messageController.sendMessage);

/**
 * @swagger
 * /api/messages/conversation/{userId}:
 *   get:
 *     tags: [Mensajes]
 *     summary: Obtener conversación con un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Límite de mensajes por página
 *     responses:
 *       200:
 *         description: Lista de mensajes de la conversación
 */
router.get('/conversation/:userId', authenticate, messageController.getConversation);

/**
 * @swagger
 * /api/messages/read/{userId}:
 *   put:
 *     tags: [Mensajes]
 *     summary: Marcar mensajes como leídos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del remitente
 *     responses:
 *       200:
 *         description: Mensajes marcados como leídos
 */
router.put('/read/:userId', authenticate, messageController.markAsRead);

/**
 * @swagger
 * /api/messages/recent:
 *   get:
 *     tags: [Mensajes]
 *     summary: Obtener conversaciones recientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversaciones recientes con último mensaje y contador de no leídos
 */
router.get('/recent', authenticate, messageController.getRecentConversations);

module.exports = router; 