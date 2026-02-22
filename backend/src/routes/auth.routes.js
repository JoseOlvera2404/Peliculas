const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */


/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registrar nuevo cliente
 *     tags: [Auth]
 *     description: Registra un cliente y envía contraseña automática por correo
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
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: El correo ya está registrado
 */
router.post('/registro', authMiddleware, rolMiddleware(1), authController.registro);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     description: Permite iniciar sesión y devuelve un JWT
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
 *       400:
 *         description: Credenciales incorrectas
 */
router.post('/login', authController.login);


/**
 * @swagger
 * /api/auth/recuperar-password:
 *   post:
 *     summary: Recuperar contraseña
 *     tags: [Auth]
 *     description: Genera una nueva contraseña y la envía al correo del usuario
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
 *                 example: jose@gmail.com
 *     responses:
 *       200:
 *         description: Nueva contraseña enviada al correo
 *       404:
 *         description: Correo no registrado
 */
router.post('/recuperar-password', authController.recuperarPassword);


module.exports = router;