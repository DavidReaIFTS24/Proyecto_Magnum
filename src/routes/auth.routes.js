// Importa el framework Express
const express = require('express');
// Crea una instancia de Router de Express, que se usará para definir las rutas
const router = express.Router();
// Importa el controlador de Autenticación, donde reside la lógica para manejar el registro, login y perfil
const AuthController = require('../controllers/auth.controller');
// Importa el middleware de autenticación, necesario para proteger ciertas rutas
const { verificarToken } = require('../middlewares/auth.middleware');

// ---------------------------------------------------------------------
// ## Rutas Públicas (No requieren autenticación)
// Estas rutas permiten el acceso a cualquier usuario para iniciar o crear una sesión.
// ---------------------------------------------------------------------

// POST /api/auth/register
// Ruta para registrar un nuevo usuario en el sistema.
router.post('/register', AuthController.registrar);

// POST /api/auth/login
// Ruta para iniciar sesión. Genera y devuelve un JSON Web Token (JWT) si las credenciales son válidas.
router.post('/login', AuthController.login);

// ---------------------------------------------------------------------
// ## Rutas Protegidas (Requieren autenticación)
// Estas rutas solo permiten el acceso si se proporciona un JWT válido.
// ---------------------------------------------------------------------

// GET /api/auth/perfil
// Ruta para obtener los datos del usuario actualmente autenticado (su "perfil").
router.get(
    '/perfil', 
    verificarToken, // Middleware: Verifica que el usuario haya proporcionado un JWT válido
    AuthController.obtenerPerfil // Controlador: Ejecuta la lógica para obtener el perfil
);

// Exporta el router configurado para que pueda ser montado en la aplicación principal de Express
module.exports = router;