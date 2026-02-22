const express = require('express');
const router = express.Router();

const peliculasController = require('../controllers/peliculas.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');

/**
 * @swagger
 * tags:
 *   name: Películas
 *   description: Endpoints para gestión y consulta de películas
 */


/**
 * @swagger
 * /api/peliculas/activas:
 *   get:
 *     summary: Listar películas activas (Público)
 *     tags: [Películas]
 *     description: Devuelve todas las películas activas disponibles para la aplicación móvil.
 *     responses:
 *       200:
 *         description: Lista de películas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: Avengers Endgame
 *                   imagen:
 *                     type: string
 *                     example: data:image/png;base64,iVBORw0KGgoAAAANS...
 *                   descripcion:
 *                     type: string
 *                     example: Película de superhéroes
 *                   trailer_link:
 *                     type: string
 *                     example: https://youtube.com/watch?v=xxxx
 *                   genero:
 *                     type: string
 *                     example: Acción
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
 *     description: Permite al administrador registrar una nueva película.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 description: Imagen en formato Base64
 *                 example: data:image/png;base64,iVBORw0KGgoAAAANS...
 *     responses:
 *       200:
 *         description: Película creada correctamente
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  authMiddleware,
  rolMiddleware(1),
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
 *     description: Devuelve todas las películas registradas, activas e inactivas.
 *     responses:
 *       200:
 *         description: Lista completa de películas
 *       401:
 *         description: No autorizado
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
 *     description: Permite actualizar los datos de una película existente.
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
 *                 description: Imagen en Base64 (opcional)
 *     responses:
 *       200:
 *         description: Película actualizada correctamente
 */
router.put(
  '/:id',
  authMiddleware,
  rolMiddleware(1),
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
 *     description: Elimina una película del sistema.
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
 *     description: Permite cambiar el estado de una película (activa/inactiva).
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