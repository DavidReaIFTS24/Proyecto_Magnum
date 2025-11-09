const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoria.controller');
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas (lectura)
router.get('/', CategoriaController.obtenerTodos);
router.get('/:id', CategoriaController.obtenerPorId);

// Rutas protegidas (escritura) - Solo ADMIN
router.post('/', verificarToken, esAdmin, CategoriaController.crear);
router.put('/:id', verificarToken, esAdmin, CategoriaController.actualizar);
router.delete('/:id', verificarToken, esAdmin, CategoriaController.eliminar);

module.exports = router;