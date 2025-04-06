const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/job.controller');
const protect = require('../middlewares/auth');

router.post('/', protect, createJob);   // Crear (requiere login y verificación)
router.get('/', getJobs);       // Obtener lista de ofertas públicas
router.get('/:id', getJobById); // Obtener oferta por ID  
router.put('/:id', protect, updateJob); // Actualizar oferta (requiere login y verificación)
router.delete('/:id', protect, deleteJob);   // Eliminar oferta (requiere login y verificación)

module.exports = router;
