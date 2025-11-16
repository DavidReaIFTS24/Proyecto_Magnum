// Importa el framework Express
const express = require('express');
// Crea una instancia de Router de Express, que se usará para definir las rutas
const router = express.Router();
// Importa el controlador de Categoría, que contiene la lógica para manejar las peticiones HTTP
const CategoriaController = require('../controllers/categoria.controller');
// Importa los middlewares de autenticación y autorización
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');

// ---------------------------------------------------------------------
// ## Rutas Públicas (Lectura)
// Estas rutas permiten el acceso sin necesidad de autenticación (sin JWT).
// ---------------------------------------------------------------------

// GET /api/categorias/
// Ruta para obtener la lista de todas las categorías.
router.get('/', CategoriaController.obtenerTodos);

// GET /api/categorias/:id
// Ruta para obtener una categoría específica por su ID.
// Parámetro dinámico: ':id'
router.get('/:id', CategoriaController.obtenerPorId);

// ---------------------------------------------------------------------
// ## Rutas Protegidas (Escritura) - Solo ADMIN
// Estas rutas requieren que el usuario esté autenticado y tenga el rol de 'admin'.
// Los middlewares se aplican de forma individual a cada ruta.
// ---------------------------------------------------------------------

// POST /api/categorias/
// Ruta para crear una nueva categoría.
router.post(
    '/', 
    verificarToken, // 1. Middleware: Verifica que el usuario esté autenticado (JWT válido)
    esAdmin,        // 2. Middleware: Verifica que el usuario sea Administrador
    CategoriaController.crear // 3. Controlador: Ejecuta la lógica de creación
);

// PUT /api/categorias/:id
// Ruta para actualizar una categoría por su ID.
// Parámetro dinámico: ':id'
router.put(
    '/:id', 
    verificarToken, // 1. Middleware: Autenticación
    esAdmin,        // 2. Middleware: Autorización (Solo Admin)
    CategoriaController.actualizar // 3. Controlador: Ejecuta la lógica de actualización
);

// DELETE /api/categorias/:id
// Ruta para eliminar una categoría por su ID.
// Parámetro dinámico: ':id'
router.delete(
    '/:id', 
    verificarToken, // 1. Middleware: Autenticación
    esAdmin,        // 2. Middleware: Autorización (Solo Admin)
    CategoriaController.eliminar // 3. Controlador: Ejecuta la lógica de eliminación
);

// Exporta el router configurado para que pueda ser montado en la aplicación principal de Express
module.exports = router;