const express = require('express');
const router = express.Router();

const peliculasController = require('../controllers/peliculas.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');
const upload = require('../config/multer');

/**
 * @swagger
 * tags:
 *   name: Películas
 *   description: Endpoints para gestión de películas
 */


/**
 * @swagger
 * /api/peliculas/activas:
 *   get:
 *     summary: Listar películas activas (Público)
 *     tags: [Películas]
 *     responses:
 *       200:
 *         description: Lista de películas activas
 */
router.get('/activas', peliculasController.listarActivas);


/**
 * @swagger
 * /api/peliculas:
 *   post:
 *     summary: Crear película (ADMIN)
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - genero_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Avengers Endgame
 *               genero_id:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: Película de superhéroes
 *               trailer_link:
 *                 type: string
 *                 example: https://youtube.com/watch?v=xxxx
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Película creada correctamente
 */
router.post(
  '/',
  authMiddleware,
  rolMiddleware(1),
  upload.single('imagen'),
  peliculasController.crearPelicula
);


/**
 * @swagger
 * /api/peliculas:
 *   get:
 *     summary: Listar todas las películas (ADMIN)
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de películas
 */
router.get(
  '/',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.listarTodas
);


/**
 * @swagger
 * /api/peliculas/{id}:
 *   put:
 *     summary: Editar película (ADMIN)
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               genero_id:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               trailer_link:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Película actualizada correctamente
 */
router.put(
  '/:id',
  authMiddleware,
  rolMiddleware(1),
  upload.single('imagen'),
  peliculasController.editarPelicula
);


/**
 * @swagger
 * /api/peliculas/{id}:
 *   delete:
 *     summary: Eliminar película (ADMIN)
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Película eliminada correctamente
 */
router.delete(
  '/:id',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.eliminarPelicula
);


/**
 * @swagger
 * /api/peliculas/{id}/estado:
 *   patch:
 *     summary: Activar o desactivar película (ADMIN)
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activa:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 */
router.patch(
  '/:id/estado',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.cambiarEstado
);

module.exports = router;