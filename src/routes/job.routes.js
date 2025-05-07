const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicants,
  updateApplicantStatus,
  reportJob,
  getJobsByCreator,
  getJobsByApplicant
} = require('../controllers/job.controller');

const protect = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

/**
 * @swagger
 * tags:
 *   name: Trabajos
 *   description: Gestión de ofertas de trabajo
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Crear una nueva oferta de trabajo (solo empresas)
 *     tags: [Trabajos]
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
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isRemote:
 *                 type: boolean
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [hora, mes, proyecto]
 *               duration:
 *                 type: string
 *               highlighted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Oferta creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo empresas pueden crear ofertas
 */
router.post('/', protect, requireRole('employer'), createJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Obtener todas las ofertas de trabajo visibles
 *     tags: [Trabajos]
 *     parameters:
 *       - in: query
 *         name: remote
 *         schema:
 *           type: boolean
 *         description: Filtrar por trabajo remoto
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filtrar por etiqueta
 *       - in: query
 *         name: highlighted
 *         schema:
 *           type: boolean
 *         description: Filtrar por ofertas destacadas
 *     responses:
 *       200:
 *         description: Lista de ofertas de trabajo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobOffer'
 */
router.get('/', getJobs);

/**
 * @swagger
 * /jobs/my-jobs:
 *   get:
 *     summary: Obtener ofertas creadas por la empresa actual
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ofertas creadas
 *       401:
 *         description: No autorizado
 */
router.get('/my-jobs', protect, requireRole('employer'), getJobsByCreator);

/**
 * @swagger
 * /jobs/my-applications:
 *   get:
 *     summary: Obtener ofertas a las que ha aplicado el estudiante
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ofertas aplicadas
 *       401:
 *         description: No autorizado
 */
router.get('/my-applications', protect, requireRole('student'), getJobsByApplicant);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Obtener una oferta específica
 *     tags: [Trabajos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oferta
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
 *     summary: Actualizar una oferta
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oferta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobOffer'
 *     responses:
 *       200:
 *         description: Oferta actualizada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para editar esta oferta
 *       404:
 *         description: Oferta no encontrada
 */
router.put('/:id', protect, requireRole('employer'), updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Eliminar una oferta
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oferta
 *     responses:
 *       200:
 *         description: Oferta eliminada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar esta oferta
 *       404:
 *         description: Oferta no encontrada
 */
router.delete('/:id', protect, requireRole('employer'), deleteJob);

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Aplicar a una oferta
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oferta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [coverLetter]
 *             properties:
 *               coverLetter:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aplicación enviada exitosamente
 *       400:
 *         description: Ya has aplicado a esta oferta
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo estudiantes pueden aplicar
 *       404:
 *         description: Oferta no encontrada
 */
router.post('/:id/apply', protect, requireRole('student'), applyToJob);

/**
 * @swagger
 * /jobs/{id}/applicants:
 *   get:
 *     summary: Obtener lista de aplicantes
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oferta
 *     responses:
 *       200:
 *         description: Lista de aplicantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para ver los aplicantes
 *       404:
 *         description: Oferta no encontrada
 */
router.get('/:id/applicants', protect, requireRole('employer'), getApplicants);

/**
 * @swagger
 * /jobs/{jobId}/applicants/{applicantId}/status:
 *   put:
 *     summary: Actualizar estado de un aplicante
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oferta
 *       - in: path
 *         name: applicantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del aplicante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, viewed, interview, hired, rejected]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para actualizar el estado
 *       404:
 *         description: Oferta o aplicante no encontrado
 */
router.put('/:jobId/applicants/:applicantId/status', protect, requireRole('employer'), updateApplicantStatus);

/**
 * @swagger
 * /jobs/{id}/report:
 *   post:
 *     summary: Reportar una oferta
 *     tags: [Trabajos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la oferta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Oferta reportada
 *       400:
 *         description: Ya has reportado esta oferta
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Oferta no encontrada
 */
router.post('/:id/report', protect, requireRole('student', 'employer'), reportJob);

module.exports = router;
