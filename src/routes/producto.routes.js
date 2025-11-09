const express = require('express');
const router = express.Router();

// Importar el controlador de Productos
const ProductoController = require('../controllers/producto.controller');

// Importar los middlewares de autenticación y autorización
const { verificarToken, esAdminOEmpleado } = require('../middlewares/auth.middleware'); 

// ===============================================
//         RUTAS DE GESTIÓN DE PRODUCTOS
// ===============================================

// Rutas de Lectura (Pueden ser públicas o requerir token, elegimos requerir token para el ejemplo)

// 1. Obtener todos los productos
// GET /api/productos
// Asumimos que esta lista puede ser vista por Admin o Empleado
router.get('/', verificarToken, esAdminOEmpleado, ProductoController.obtenerTodos);

// 2. Obtener producto por ID
// GET /api/productos/:id
router.get('/:id', verificarToken, esAdminOEmpleado, ProductoController.obtenerPorId);

// 3. Obtener productos por categoría
// NOTA: Colocamos esta ruta antes de la ruta ':id' para que Express no confunda 'categoria' con un ID.
// GET /api/productos/categoria/:categoriaId
router.get('/categoria/:categoriaId', verificarToken, esAdminOEmpleado, ProductoController.obtenerPorCategoria);


// Rutas de Escritura/Modificación/Eliminación (Requieren permisos de Admin o Empleado)

// 4. Crear un nuevo producto
// POST /api/productos
router.post('/', verificarToken, esAdminOEmpleado, ProductoController.crear);

// 5. Actualizar un producto por ID
// PUT /api/productos/:id
router.put('/:id', verificarToken, esAdminOEmpleado, ProductoController.actualizar);

// 6. Eliminar (desactivar) un producto por ID
// DELETE /api/productos/:id
router.delete('/:id', verificarToken, esAdminOEmpleado, ProductoController.eliminar);


module.exports = router;