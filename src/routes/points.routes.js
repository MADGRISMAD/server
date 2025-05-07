const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/points.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Points:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario
 *         totalPoints:
 *           type: number
 *           description: Total de puntos disponibles
 *         pointsHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [earned, spent, refunded]
 *               source:
 *                 type: string
 *                 enum: [review, job_application, auction]
 *               description:
 *                 type: string
 *         activeBids:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               job:
 *                 type: string
 *               points:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, won, lost, cancelled]
 *               position:
 *                 type: number
 */

/**
 * @swagger
 * /api/points:
 *   get:
 *     summary: Obtener puntos del usuario
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Puntos obtenidos exitosamente
 */
router.get('/', protect, pointsController.getUserPoints);

/**
 * @swagger
 * /api/points/history:
 *   get:
 *     summary: Obtener historial de puntos
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 */
router.get('/history', protect, pointsController.getPointsHistory);

/**
 * @swagger
 * /api/points/bid/{jobId}:
 *   post:
 *     summary: Realizar una puja en una oferta de trabajo
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Puja realizada exitosamente
 */
router.post('/bid/:jobId', protect, pointsController.placeBid);

/**
 * @swagger
 * /api/points/bid/{jobId}:
 *   delete:
 *     summary: Cancelar una puja
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Puja cancelada exitosamente
 */
router.delete('/bid/:jobId', protect, pointsController.cancelBid);

/**
 * @swagger
 * /api/points/job/{jobId}/bids:
 *   get:
 *     summary: Obtener ranking de pujas para un trabajo
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ranking obtenido exitosamente
 */
router.get('/job/:jobId/bids', protect, pointsController.getJobBids);

module.exports = router; 