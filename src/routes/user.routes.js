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
 *               university:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, employer]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
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
 *               university:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
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

