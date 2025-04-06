const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob,applyToJob, getApplicants, updateApplicantStatus,reportJob } = require('../controllers/job.controller');
const protect = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

/**
 * @swagger
 * tags:
 *   name: Empleos
 *   description: Gestión de ofertas laborales y postulaciones
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Crear una nueva oferta laboral
 *     tags: [Empleos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *               company:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isRemote:
 *                 type: boolean
 *               salaryRange:
 *                 type: string
 *               duration:
 *                 type: string
 *               highlighted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Oferta creada
 *       401:
 *         description: No autorizado
 */
router.post('/', protect, requireRole('employer'), createJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Obtener todas las ofertas públicas
 *     tags: [Empleos]
 *     responses:
 *       200:
 *         description: Lista de ofertas laborales
 */
router.get('/', getJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Obtener detalles de una oferta laboral por ID
 *     tags: [Empleos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la oferta
 *       404:
 *         description: Oferta no encontrada
 */
router.get('/:id', getJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Actualizar una oferta laboral
 *     tags: [Empleos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Oferta actualizada
 *       401:
 *         description: No autorizado
 */
router.put('/:id', protect, updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Eliminar una oferta laboral
 *     tags: [Empleos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Oferta eliminada
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', protect, deleteJob);

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Postularse a una oferta laboral
 *     tags: [Empleos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverLetter:
 *                 type: string
 *     responses:
 *       200:
 *         description: Postulación exitosa
 *       401:
 *         description: No autorizado
 */
router.post('/:id/apply', protect, requireRole('student'), applyToJob);

/**
 * @swagger
 * /jobs/{id}/applicants:
 *   get:
 *     summary: Obtener postulantes de una oferta
 *     tags: [Empleos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de postulantes
 *       401:
 *         description: No autorizado
 */
router.get('/:id/applicants', protect, getApplicants);

/**
 * @swagger
 * /jobs/{jobId}/applicants/{applicantId}:
 *   put:
 *     summary: Actualizar estado de un postulante
 *     tags: [Empleos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: applicantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: interview
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       401:
 *         description: No autorizado
 */
router.put('/:jobId/applicants/:applicantId', protect, updateApplicantStatus);

/**
 * @swagger
 * /jobs/{id}/report:
 *   post:
 *     summary: Reportar una oferta laboral como inapropiada
 *     tags: [Empleos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reporte registrado
 *       400:
 *         description: Ya has reportado esta oferta
 *       401:
 *         description: No autorizado
 */
router.post('/:id/report', protect, requireRole('student', 'employer'), reportJob);


module.exports = router;
