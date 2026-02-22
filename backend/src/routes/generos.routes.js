const express = require('express');
const router = express.Router();
const generosController = require('../controllers/generos.controller');

router.get('/', generosController.listarGeneros);

module.exports = router;