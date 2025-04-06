const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob,applyToJob, getApplicants, updateApplicantStatus } = require('../controllers/job.controller');
const protect = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');

router.post('/', protect, requireRole('employer'), createJob);   // Crear (requiere login y verificación)
router.get('/', getJobs);       // Obtener lista de ofertas públicas
router.get('/:id', getJobById); // Obtener oferta por ID  
router.put('/:id', protect, updateJob); // Actualizar oferta (requiere login y verificación)
router.delete('/:id', protect, deleteJob);   // Eliminar oferta (requiere login y verificación)
router.post('/:id/apply', protect, requireRole('student'), applyToJob);
router.get('/:id/applicants', protect, getApplicants);
router.put('/:jobId/applicants/:applicantId', protect, updateApplicantStatus);




module.exports = router;
