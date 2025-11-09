const express = require('express');
const router = express.Router();

// Importar el controlador de Pedidos
const PedidoController = require('../controllers/pedido.controller');

// Importar los middlewares de autenticación y autorización
const { verificarToken, esAdmin, esAdminOEmpleado } = require('../middlewares/auth.middleware'); 

// ===============================================
//         RUTAS DE GESTIÓN DE PEDIDOS
// ===============================================

// 1. Crear un nuevo pedido (Requiere token. Asumimos que puede ser creado por Admin o Empleado)
// POST /api/pedidos
router.post('/', verificarToken, esAdminOEmpleado, PedidoController.crear);

// 2. Obtener TODOS los pedidos (Solo Admin o Empleado)
// GET /api/pedidos
router.get('/', verificarToken, esAdminOEmpleado, PedidoController.obtenerTodos);

// 3. Obtener pedido por ID (Solo Admin o Empleado)
// GET /api/pedidos/:id
router.get('/:id', verificarToken, esAdminOEmpleado, PedidoController.obtenerPorId);

// 4. Obtener pedidos por ID de cliente (Solo Admin o Empleado)
// GET /api/pedidos/cliente/:clienteId
router.get('/cliente/:clienteId', verificarToken, esAdminOEmpleado, PedidoController.obtenerPorCliente);

// 5. Obtener pedidos por estado (Solo Admin o Empleado)
// NOTA: Colocamos esta ruta antes de la ruta ':id' para que Express no confunda 'estado' con un ID.
// GET /api/pedidos/estado/:estado
router.get('/estado/:estado', verificarToken, esAdminOEmpleado, PedidoController.obtenerPorEstado);


// 6. Actualizar información general del pedido (Requiere Admin o Empleado)
// PUT /api/pedidos/:id
router.put('/:id', verificarToken, esAdminOEmpleado, PedidoController.actualizar);

// 7. Cambiar el estado de un pedido (Requiere Admin o Empleado)
// PUT /api/pedidos/:id/estado
router.put('/:id/estado', verificarToken, esAdminOEmpleado, PedidoController.cambiarEstado);

// 8. Cancelar (Eliminación lógica/Cambio de estado) un pedido (Requiere Admin o Empleado)
// DELETE /api/pedidos/:id
router.delete('/:id', verificarToken, esAdminOEmpleado, PedidoController.cancelar);


module.exports = router;