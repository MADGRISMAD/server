const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const { protect, restrictTo } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: ID del usuario
 *         projects:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     publicId:
 *                       type: string
 *         skills:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Principiante, Intermedio, Avanzado, Experto]
 *               category:
 *                 type: string
 *                 enum: [Frontend, Backend, DevOps, Diseño, Otros]
 */

/**
 * @swagger
 * /api/portfolio:
 *   post:
 *     summary: Crear o actualizar portafolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       200:
 *         description: Portafolio creado/actualizado exitosamente
 */
router.post('/', protect, portfolioController.createOrUpdatePortfolio);

/**
 * @swagger
 * /api/portfolio/{userId}:
 *   get:
 *     summary: Obtener portafolio de un usuario
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portafolio encontrado
 */
router.get('/:userId', portfolioController.getPortfolio);

/**
 * @swagger
 * /api/portfolio/project:
 *   post:
 *     summary: Agregar proyecto al portafolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Proyecto agregado exitosamente
 */
router.post('/project', protect, upload.array('images', 5), portfolioController.addProject);

/**
 * @swagger
 * /api/portfolio/project/{projectId}:
 *   delete:
 *     summary: Eliminar proyecto del portafolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 */
router.delete('/project/:projectId', protect, portfolioController.deleteProject);

/**
 * @swagger
 * /api/portfolio/generate-cv:
 *   post:
 *     summary: Generar CV en PDF
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CV generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     cvUrl:
 *                       type: string
 */
router.post('/generate-cv', protect, portfolioController.generateCV);

module.exports = router; 