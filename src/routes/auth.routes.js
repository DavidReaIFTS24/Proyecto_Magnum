const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// Rutas públicas
router.post('/register', AuthController.registrar);
router.post('/login', AuthController.login);

// Rutas protegidas
router.get('/perfil', verificarToken, AuthController.obtenerPerfil);

module.exports = router;