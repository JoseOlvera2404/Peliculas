const express = require('express');
const router = express.Router();
const generosController = require('../controllers/generos.controller');

/**
 * @swagger
 * tags:
 *   name: Géneros
 *   description: Endpoints para la gestión y consulta de géneros de películas
 */


/**
 * @swagger
 * /api/generos:
 *   get:
 *     summary: Listar géneros disponibles
 *     tags: [Géneros]
 *     description: Devuelve la lista completa de géneros registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de géneros obtenida correctamente
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
 *                     example: Acción
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', generosController.listarGeneros);

module.exports = router;