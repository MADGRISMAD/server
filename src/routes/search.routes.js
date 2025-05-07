const express = require('express');
const router = express.Router();
const { searchJobs, searchStudents } = require('../controllers/search.controller');
const protect = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Búsqueda
 *   description: Funcionalidades de búsqueda de trabajos y estudiantes
 */

/**
 * @swagger
 * /search/jobs:
 *   get:
 *     summary: Buscar ofertas de trabajo
 *     tags: [Búsqueda]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: remote
 *         schema:
 *           type: boolean
 *         description: Filtrar por trabajos remotos
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filtrar por etiquetas
 *       - in: query
 *         name: highlighted
 *         schema:
 *           type: boolean
 *         description: Filtrar por ofertas destacadas
 *     responses:
 *       200:
 *         description: Lista de ofertas de trabajo que coinciden con la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
router.get('/jobs', searchJobs);

/**
 * @swagger
 * /search/students:
 *   get:
 *     summary: Buscar estudiantes
 *     tags: [Búsqueda]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filtrar por habilidades
 *       - in: query
 *         name: university
 *         schema:
 *           type: string
 *         description: Filtrar por universidad
 *       - in: query
 *         name: major
 *         schema:
 *           type: string
 *         description: Filtrar por carrera
 *     responses:
 *       200:
 *         description: Lista de estudiantes que coinciden con la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 */
router.get('/students', protect, searchStudents);

module.exports = router; 