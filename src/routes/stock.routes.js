const express = require('express');
const router = express.Router();

// Importar el controlador de Stock
const StockController = require('../controllers/stock.controller');

// Importar los middlewares de autenticación y autorización
// Requerimos esAdminOEmpleado para la gestión de inventario
const { verificarToken, esAdminOEmpleado } = require('../middlewares/auth.middleware'); 

// ===============================================
//         RUTAS DE GESTIÓN DE STOCK (INVENTARIO)
// ===============================================

// Rutas de Lectura (Requieren Admin o Empleado)

// 1. Obtener todos los registros de stock
// GET /api/stock
router.get('/', verificarToken, esAdminOEmpleado, StockController.obtenerTodos);

// 2. Obtener un registro de stock por ID
// GET /api/stock/:id
router.get('/:id', verificarToken, esAdminOEmpleado, StockController.obtenerPorId);

// 3. Obtener el registro de stock asociado a un producto
// NOTA: Debe ir ANTES de la ruta :id, pero después de /bajo-stock.
// GET /api/stock/producto/:productoId
router.get('/producto/:productoId', verificarToken, esAdminOEmpleado, StockController.obtenerPorProducto);

// 4. Obtener productos con stock bajo (Reporte)
// NOTA: Colocamos esta ruta con una palabra clave para evitar conflicto con la ruta :id.
// GET /api/stock/bajo-stock
router.get('/bajo-stock', verificarToken, esAdminOEmpleado, StockController.obtenerBajoStock);


// Rutas de Escritura/Modificación/Eliminación (Requieren Admin o Empleado)

// 5. Crear un nuevo registro de stock
// POST /api/stock
router.post('/', verificarToken, esAdminOEmpleado, StockController.crear);

// 6. Actualizar un registro de stock por ID
// PUT /api/stock/:id
router.put('/:id', verificarToken, esAdminOEmpleado, StockController.actualizar);

// 7. Aumentar el stock de un producto específico (por ProductoId)
// PUT /api/stock/aumentar/:productoId
router.put('/aumentar/:productoId', verificarToken, esAdminOEmpleado, StockController.aumentarStock);

// 8. Eliminar un registro de stock por ID
// DELETE /api/stock/:id
router.delete('/:id', verificarToken, esAdminOEmpleado, StockController.eliminar);


module.exports = router;