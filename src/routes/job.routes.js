const express = require('express');
const router = express.Router();
const { createJob, getJobs } = require('../controllers/job.controller');
const protect = require('../middlewares/auth');

router.post('/', protect, createJob);   // Crear (requiere login y verificación)
router.get('/', getJobs);               // Listar (público)

module.exports = router;
