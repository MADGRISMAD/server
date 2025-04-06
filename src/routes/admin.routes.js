const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const JobOffer = require('../models/JobOffer');
const User = require('../models/User');

const adminOnly = [protect, requireRole('admin')];

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Funciones administrativas (solo accesibles por el rol admin)
 */

/**
 * @swagger
 * /admin/jobs:
 *   get:
 *     summary: Ver todas las ofertas laborales (modo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ofertas laborales con detalles de creador
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso prohibido
 */
router.get('/jobs', adminOnly, async (req, res) => {
    const jobs = await JobOffer.find().populate('createdBy', 'fullName email role');
    res.json(jobs);
  });
  
  /**
   * @swagger
   * /admin/jobs/{id}:
   *   delete:
   *     summary: Eliminar una oferta laboral (modo admin)
   *     tags: [Admin]
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
   *         description: Oferta eliminada exitosamente
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Acceso prohibido
   *       404:
   *         description: Oferta no encontrada
   */
  router.delete('/jobs/:id', adminOnly, async (req, res) => {
    await JobOffer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Oferta eliminada por admin' });
  });
  
  /**
   * @swagger
   * /admin/users:
   *   get:
   *     summary: Ver todos los usuarios registrados (modo admin)
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios (sin contraseñas)
   *       401:
   *         description: No autorizado
   *       403:
   *         description: Acceso prohibido
   */
  router.get('/users', adminOnly, async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
  });
  
module.exports = router;
