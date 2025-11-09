const express = require('express');
const router = express.Router();

// Importar el controlador
const ClienteController = require('../controllers/cliente.controller');

// Importar los middlewares de autenticación
// Asumo que este archivo de middlewares está en la ruta: ../middlewares/auth.middleware
const { verificarToken, esAdmin, esAdminOEmpleado } = require('../middlewares/auth.middleware'); 

// ===============================================
//         RUTAS DE GESTIÓN DE CLIENTES
// ===============================================

// 1. Obtener todos los clientes (Solo Admin o Empleado)
// GET /api/clientes
router.get('/', verificarToken, esAdminOEmpleado, ClienteController.obtenerTodos);

// 2. Obtener cliente por ID (Solo Admin o Empleado)
// GET /api/clientes/:id
router.get('/:id', verificarToken, esAdminOEmpleado, ClienteController.obtenerPorId);

// 3. Crear un nuevo cliente (Solo Admin)
// POST /api/clientes
router.post('/', verificarToken, esAdmin, ClienteController.crear);

// 4. Actualizar un cliente por ID (Solo Admin)
// PUT /api/clientes/:id
router.put('/:id', verificarToken, esAdmin, ClienteController.actualizar);

// 5. Eliminar/Desactivar un cliente por ID (Solo Admin)
// DELETE /api/clientes/:id
router.delete('/:id', verificarToken, esAdmin, ClienteController.eliminar);


module.exports = router;