const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y gestión de cuentas
 */


/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar usuario (Solo ADMIN)
 *     tags: [Auth]
 *     description: Permite al administrador crear un nuevo usuario (Administrador o Cliente). Se envía contraseña temporal por correo.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido_paterno
 *               - correo
 *               - rol_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Jose
 *               apellido_paterno:
 *                 type: string
 *                 example: Olvera
 *               apellido_materno:
 *                 type: string
 *                 example: Garcia
 *               correo:
 *                 type: string
 *                 example: jose@gmail.com
 *               rol_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Rol inválido o correo ya registrado
 *       401:
 *         description: No autorizado
 */
router.post(
  '/registro',
  authMiddleware,
  rolMiddleware(1),
  authController.registro
);


/**
 * @swagger
 * /api/auth/login-admin:
 *   post:
 *     summary: Iniciar sesión ADMIN (Web)
 *     tags: [Auth]
 *     description: Autentica administradores para el sistema web. Devuelve un JWT válido por 8 horas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login correcto
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: Jose
 *                     rol:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       403:
 *         description: Acceso permitido solo para administradores
 */
router.post('/login-admin', authController.loginAdmin);


/**
 * @swagger
 * /api/auth/login-cliente:
 *   post:
 *     summary: Iniciar sesión CLIENTE (App Android)
 *     tags: [Auth]
 *     description: Autentica clientes para la aplicación móvil. Devuelve un JWT válido por 8 horas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 example: cliente@gmail.com
 *               password:
 *                 type: string
 *                 example: cliente123
 *     responses:
 *       200:
 *         description: Login correcto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login correcto
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     nombre:
 *                       type: string
 *                       example: Maria
 *                     rol:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       403:
 *         description: Acceso permitido solo para clientes
 */
router.post('/login-cliente', authController.loginCliente);


/**
 * @swagger
 * /api/auth/recuperar-password:
 *   post:
 *     summary: Recuperar contraseña
 *     tags: [Auth]
 *     description: Genera una nueva contraseña temporal y la envía por correo electrónico en formato HTML.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@gmail.com
 *     responses:
 *       200:
 *         description: Nueva contraseña enviada al correo
 *       404:
 *         description: Correo no registrado
 */
router.post('/recuperar-password', authController.recuperarPassword);


module.exports = router;