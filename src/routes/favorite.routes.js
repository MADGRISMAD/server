const express = require('express');
const router = express.Router();
const {
  addToFavorites,
  removeFromFavorites,
  getFavoriteJobs,
  checkFavoriteStatus
} = require('../controllers/favorite.controller');
const protect = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Favoritos
 *   description: Gestión de ofertas de trabajo favoritas
 */

/**
 * @swagger
 * /favorites/{jobId}:
 *   post:
 *     summary: Agregar trabajo a favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajo
 *     responses:
 *       200:
 *         description: Trabajo agregado a favoritos exitosamente
 *       400:
 *         description: Este trabajo ya está en tus favoritos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Trabajo no encontrado
 */
router.post('/:jobId', protect, addToFavorites);

/**
 * @swagger
 * /favorites/{jobId}:
 *   delete:
 *     summary: Remover trabajo de favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajo
 *     responses:
 *       200:
 *         description: Trabajo removido de favoritos exitosamente
 *       400:
 *         description: Este trabajo no está en tus favoritos
 *       401:
 *         description: No autorizado
 */
router.delete('/:jobId', protect, removeFromFavorites);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Obtener lista de trabajos favoritos
 *     tags: [Favoritos]
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
 *         description: Límite de trabajos por página
 *     responses:
 *       200:
 *         description: Lista de trabajos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobOffer'
 *                 currentPage:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalJobs:
 *                   type: number
 *       401:
 *         description: No autorizado
 */
router.get('/', protect, getFavoriteJobs);

/**
 * @swagger
 * /favorites/check/{jobId}:
 *   get:
 *     summary: Verificar si un trabajo está en favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajo
 *     responses:
 *       200:
 *         description: Estado de favorito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *       401:
 *         description: No autorizado
 */
router.get('/check/:jobId', protect, checkFavoriteStatus);

module.exports = router; 