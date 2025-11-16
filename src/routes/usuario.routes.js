// Importa el framework Express
const express = require('express');
// Crea una instancia de Router de Express, que se usará para definir las rutas
const router = express.Router();
// Importa el controlador de Usuario, donde reside la lógica para manejar las peticiones HTTP
const UsuarioController = require('../controllers/usuario.controller');
// Importa los middlewares de autenticación y autorización
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// --- Configuración de Middlewares de Acceso Global ---

// Middleware que se aplica a TODAS las rutas definidas DESPUÉS de esta línea.
// 1. **verificarToken:** Asegura que solo los usuarios que envían un JWT válido en la cabecera
//    de la petición puedan acceder a las rutas siguientes.
router.use(verificarToken);

// 2. **esAdmin:** Se aplica después de verificar el token. Asegura que el usuario autenticado
//    tenga el rol de 'admin' para continuar a las rutas siguientes.
//    => Conclusión: Solo los administradores autenticados pueden usar las rutas CRUD definidas abajo.
router.use(esAdmin);

// --- Definición de Rutas CRUD para Usuarios (Solo Admin) ---

// GET /api/usuarios/
// Ruta para obtener la lista de todos los usuarios.
router.get('/', UsuarioController.obtenerTodos);

// GET /api/usuarios/:id
// Ruta para obtener un usuario específico por su ID.
// Parámetro dinámico: ':id'
router.get('/:id', UsuarioController.obtenerPorId);

// PUT /api/usuarios/:id
// Ruta para actualizar los datos de un usuario por su ID.
// Parámetro dinámico: ':id'
router.put('/:id', UsuarioController.actualizar);

// DELETE /api/usuarios/:id
// Ruta para eliminar un usuario por su ID.
// Parámetro dinámico: ':id'
router.delete('/:id', UsuarioController.eliminar);

// Exporta el router configurado para que pueda ser utilizado por el archivo principal de Express (ej: app.js)
module.exports = router;