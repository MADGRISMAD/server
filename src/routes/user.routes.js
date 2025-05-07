const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, verifyEmail, updateProfile } = require('../controllers/user.controller');
const validateEduEmail = require('../middlewares/validateEduEmail');
const protect = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Registro, login y gestión de perfil
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar un nuevo usuario (requiere email .edu)
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, employer]
 *               # Campos específicos para estudiantes
 *               university:
 *                 type: string
 *               major:
 *                 type: string
 *               graduationYear:
 *                 type: number
 *               currentSemester:
 *                 type: number
 *               gpa:
 *                 type: number
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                     level:
 *                       type: string
 *                       enum: [básico, intermedio, avanzado, nativo]
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     description:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     isCurrent:
 *                       type: boolean
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     technologies:
 *                       type: array
 *                       items:
 *                         type: string
 *                     url:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     issuer:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     url:
 *                       type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                   github:
 *                     type: string
 *                   portfolio:
 *                     type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *                   isRemote:
 *                     type: boolean
 *               availability:
 *                 type: string
 *                 enum: [full-time, part-time, internship, project-based]
 *               preferredSalary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *                     default: USD
 *               # Campos específicos para empresas
 *               company:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   website:
 *                     type: string
 *                   description:
 *                     type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos
 *       409:
 *         description: Usuario ya existe
 */
router.post('/register', validateEduEmail, registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada exitosamente
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtener información del perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /users/verify/{token}:
 *   get:
 *     summary: Verificar correo electrónico
 *     tags: [Usuarios]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Token de verificación enviado por correo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verificación exitosa
 *       400:
 *         description: Token inválido o expirado
 */
router.get('/verify/:token', verifyEmail);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Actualizar el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               # Campos específicos para estudiantes
 *               university:
 *                 type: string
 *               major:
 *                 type: string
 *               graduationYear:
 *                 type: number
 *               currentSemester:
 *                 type: number
 *               gpa:
 *                 type: number
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: string
 *                     level:
 *                       type: string
 *                       enum: [básico, intermedio, avanzado, nativo]
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     company:
 *                       type: string
 *                     description:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     isCurrent:
 *                       type: boolean
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     technologies:
 *                       type: array
 *                       items:
 *                         type: string
 *                     url:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     issuer:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     url:
 *                       type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   linkedin:
 *                     type: string
 *                   github:
 *                     type: string
 *                   portfolio:
 *                     type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *                   isRemote:
 *                     type: boolean
 *               availability:
 *                 type: string
 *                 enum: [full-time, part-time, internship, project-based]
 *               preferredSalary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *                     default: USD
 *               # Campos específicos para empresas
 *               company:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   website:
 *                     type: string
 *                   description:
 *                     type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       401:
 *         description: No autorizado
 */
router.put('/me', protect, updateProfile);

module.exports = router;

