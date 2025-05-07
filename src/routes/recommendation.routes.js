const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/recommendations/students/{jobId}:
 *   get:
 *     tags: [Recomendaciones]
 *     summary: Obtener recomendaciones de estudiantes para un trabajo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajo
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
 *           default: 10
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de estudiantes recomendados
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Trabajo no encontrado
 */
router.get('/students/:jobId', authenticate, recommendationController.getStudentRecommendations);

/**
 * @swagger
 * /api/recommendations/jobs:
 *   get:
 *     tags: [Recomendaciones]
 *     summary: Obtener recomendaciones de trabajos para un estudiante
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           default: 10
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de trabajos recomendados
 *       404:
 *         description: Estudiante no encontrado
 */
router.get('/jobs', authenticate, recommendationController.getJobRecommendations);

module.exports = router; 