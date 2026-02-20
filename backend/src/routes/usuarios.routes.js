const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y clientes
 */


/**
 * @swagger
 * /api/usuarios/clientes:
 *   get:
 *     summary: Listar clientes (ADMIN)
 *     description: Devuelve la lista de usuarios con rol CLIENTE
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   nombre:
 *                     type: string
 *                     example: Jose
 *                   apellido_paterno:
 *                     type: string
 *                     example: Olvera
 *                   apellido_materno:
 *                     type: string
 *                     example: Garcia
 *                   correo:
 *                     type: string
 *                     example: jose@gmail.com
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: No tiene permisos
 */
router.get(
  '/clientes',
  authMiddleware,
  rolMiddleware(1),
  usuariosController.listarClientes
);

module.exports = router;