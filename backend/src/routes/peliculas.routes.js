const express = require('express');
const router = express.Router();

const peliculasController = require('../controllers/peliculas.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');


// PUBLICO
router.get('/activas', peliculasController.listarActivas);


// ADMIN
router.post(
  '/',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.crearPelicula
);

router.get(
  '/',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.listarTodas
);

router.put(
  '/:id',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.editarPelicula
);

router.delete(
  '/:id',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.eliminarPelicula
);

router.patch(
  '/:id/estado',
  authMiddleware,
  rolMiddleware(1),
  peliculasController.cambiarEstado
);

module.exports = router;