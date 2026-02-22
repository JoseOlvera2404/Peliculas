const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y clientes (solo ADMIN)
 */


/**
 * @swagger
 * /api/usuarios/clientes:
 *   get:
 *     summary: Listar clientes (ADMIN)
 *     description: Devuelve la lista de usuarios con rol CLIENTE.
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
 *                   activo:
 *                     type: boolean
 *                     example: true
 *                   fecha_creacion:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos
 */
router.get(
  '/clientes',
  authMiddleware,
  rolMiddleware(1),
  usuariosController.listarClientes
);


/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios (ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     description: Devuelve la lista completa de usuarios con su rol y estado.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *       401:
 *         description: No autorizado
 */
router.get(
  '/',
  authMiddleware,
  rolMiddleware(1),
  usuariosController.listarUsuarios
);


/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Editar usuario (ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     description: Permite actualizar la información básica de un usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido_paterno:
 *                 type: string
 *                 example: Pérez
 *               apellido_materno:
 *                 type: string
 *                 example: López
 *               correo:
 *                 type: string
 *                 example: juan@gmail.com
 *               rol_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       401:
 *         description: No autorizado
 */
router.put(
  '/:id',
  authMiddleware,
  rolMiddleware(1),
  usuariosController.editarUsuario
);


/**
 * @swagger
 * /api/usuarios/{id}/estado:
 *   patch:
 *     summary: Activar o desactivar usuario (ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     description: Cambia el estado activo/inactivo del usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       401:
 *         description: No autorizado
 */
router.patch(
  '/:id/estado',
  authMiddleware,
  rolMiddleware(1),
  usuariosController.cambiarEstado
);


/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario (ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     description: Elimina un usuario del sistema.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autorizado
 */
router.delete(
  '/:id',
  authMiddleware,
  rolMiddleware(1),
  usuariosController.eliminarUsuario
);

module.exports = router;