const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/job.controller');
const protect = require('../middlewares/auth');

router.post('/', protect, createJob);   // Crear (requiere login y verificación)
router.get('/', getJobs);       // Obtener lista de ofertas públicas
router.get('/:id', getJobById); // Obtener oferta por ID        

module.exports = router;
