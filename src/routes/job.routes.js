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

// Crear oferta (solo empresas)
router.post('/', protect, requireRole('employer'), createJob);

// Listar ofertas visibles públicamente (explorar)
router.get('/', getJobs);

// Ver trabajos creados por un empleador logueado
router.get('/my-jobs', protect, requireRole('employer'), getJobsByCreator);

// Ver trabajos donde aplicó un estudiante logueado
router.get('/my-applications', protect, requireRole('student'), getJobsByApplicant);

// Detalle de oferta
router.get('/:id', getJobById);

// Editar oferta (dueño)
router.put('/:id', protect, updateJob);

// Eliminar oferta (dueño)
router.delete('/:id', protect, deleteJob);

// Aplicar a una oferta
router.post('/:id/apply', protect, requireRole('student'), applyToJob);

// Ver aplicantes de una oferta
router.get('/:id/applicants', protect, getApplicants);

// Cambiar estado de un aplicante
router.put('/:jobId/applicants/:applicantId', protect, updateApplicantStatus);

// Reportar una oferta
router.post('/:id/report', protect, requireRole('student', 'employer'), reportJob);

module.exports = router;
