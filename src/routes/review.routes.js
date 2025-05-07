const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getJobReviews,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');
const protect = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Reseñas
 *   description: Sistema de calificaciones y reseñas
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Crear una nueva reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - reviewedId
 *               - rating
 *               - comment
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID del trabajo
 *               reviewedId:
 *                 type: string
 *                 description: ID del usuario a calificar
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Calificación general
 *               comment:
 *                 type: string
 *                 description: Comentario de la reseña
 *               categories:
 *                 type: object
 *                 properties:
 *                   professionalism:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                   communication:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                   punctuality:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                   skills:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *       400:
 *         description: Ya has calificado este trabajo
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para calificar este trabajo
 *       404:
 *         description: Trabajo no encontrado
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     summary: Obtener reseñas de un usuario
 *     tags: [Reseñas]
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
 *           default: 10
 *         description: Límite de reseñas por página
 *     responses:
 *       200:
 *         description: Lista de reseñas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 currentPage:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalReviews:
 *                   type: number
 */
router.get('/user/:userId', getUserReviews);

/**
 * @swagger
 * /reviews/job/{jobId}:
 *   get:
 *     summary: Obtener reseñas de un trabajo
 *     tags: [Reseñas]
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
 *         description: Límite de reseñas por página
 *     responses:
 *       200:
 *         description: Lista de reseñas del trabajo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 currentPage:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalReviews:
 *                   type: number
 */
router.get('/job/:jobId', getJobReviews);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Actualizar una reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               categories:
 *                 type: object
 *                 properties:
 *                   professionalism:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                   communication:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                   punctuality:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *                   skills:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 5
 *     responses:
 *       200:
 *         description: Reseña actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para editar esta reseña
 *       404:
 *         description: Reseña no encontrada
 */
router.put('/:reviewId', protect, updateReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Eliminar una reseña
 *     tags: [Reseñas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reseña
 *     responses:
 *       200:
 *         description: Reseña eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar esta reseña
 *       404:
 *         description: Reseña no encontrada
 */
router.delete('/:reviewId', protect, deleteReview);

module.exports = router; 