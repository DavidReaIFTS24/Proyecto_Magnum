const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación y ser ADMIN
router.use(verificarToken);
router.use(esAdmin);

router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', UsuarioController.eliminar);

module.exports = router;