// Importa la capa de servicio, donde reside la lógica de negocio (validaciones, transacciones, interacción con el modelo)
const PedidoService = require('../services/pedido.service');

// Define la clase de controlador que mapea las peticiones HTTP a la lógica de negocio
class PedidoController {

  // --- 1. Crear Nuevo Pedido (POST /api/pedidos) ---

  /**
   * Maneja la petición para crear un nuevo pedido.
   * Requiere el ID del usuario autenticado para registrar quién creó el pedido.
   */
  static async crear(req, res, next) {
    try {
      // Registro de la petición entrante
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/pedidos');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      // Accede al ID del usuario autenticado (adjuntado por el middleware verificarToken)
      console.log('👤 Usuario que crea el pedido:', req.usuario.email); 

      // Delega la creación y la lógica de negocio (validación de stock, etc.) al servicio
      const pedido = await PedidoService.crear(req.body, req.usuario.id);

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA: Pedido creado');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente con código 201 Created
      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        data: pedido
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el error de 'Stock insuficiente' (responde con 400 Bad Request)
      if (error.message.includes('Stock insuficiente')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error); // Pasa otros errores al manejador global
    }
  }

  // --- 2. Obtener Todos los Pedidos (GET /api/pedidos) ---

  /**
   * Maneja la petición para obtener una lista de todos los pedidos.
   */
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/pedidos');

      // Delega la obtención de datos al servicio
      const pedidos = await PedidoService.obtenerTodos();

      console.log('✅ RESPUESTA EXITOSA:', pedidos.length, 'pedidos encontrados');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente
      res.json({
        success: true,
        count: pedidos.length,
        data: pedidos
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 3. Obtener Pedido por ID (GET /api/pedidos/:id) ---

  /**
   * Maneja la petición para obtener un pedido por su ID.
   */
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/pedidos/${req.params.id}`);

      // Delega la búsqueda al servicio
      const pedido = await PedidoService.obtenerPorId(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Pedido encontrado');
      console.log('==========================================\n');

      res.json({
        success: true,
        data: pedido
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Pedido no encontrado' (responde con 404)
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 4. Obtener Pedidos por Cliente (GET /api/pedidos/cliente/:clienteId) ---

  /**
   * Maneja la petición para obtener pedidos filtrados por el ID de un cliente.
   */
  static async obtenerPorCliente(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/pedidos/cliente/${req.params.clienteId}`);

      // Delega la búsqueda filtrada al servicio
      const pedidos = await PedidoService.obtenerPorCliente(req.params.clienteId);

      console.log('✅ RESPUESTA EXITOSA:', pedidos.length, 'pedidos encontrados');
      console.log('==========================================\n');

      res.json({
        success: true,
        count: pedidos.length,
        data: pedidos
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 5. Obtener Pedidos por Estado (GET /api/pedidos/estado/:estado) ---

  /**
   * Maneja la petición para obtener pedidos filtrados por su estado actual.
   */
  static async obtenerPorEstado(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/pedidos/estado/${req.params.estado}`);

      // Delega la búsqueda filtrada al servicio
      const pedidos = await PedidoService.obtenerPorEstado(req.params.estado);

      console.log('✅ RESPUESTA EXITOSA:', pedidos.length, 'pedidos encontrados');
      console.log('==========================================\n');

      res.json({
        success: true,
        count: pedidos.length,
        data: pedidos
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 6. Cambiar Estado del Pedido (PUT /api/pedidos/:id/estado) ---

  /**
   * Maneja la petición para actualizar únicamente el estado de un pedido.
   */
  static async cambiarEstado(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/pedidos/${req.params.id}/estado`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      const { estado } = req.body;

      // Validación simple en el controlador (se complementa con la validación del servicio)
      if (!estado) {
        return res.status(400).json({ // 400 Bad Request
          success: false,
          message: 'El estado es requerido'
        });
      }

      // Delega la actualización al servicio
      const pedido = await PedidoService.cambiarEstado(req.params.id, estado);

      console.log('✅ RESPUESTA EXITOSA: Estado actualizado');
      console.log('==========================================\n');

      res.json({
        success: true,
        message: 'Estado actualizado exitosamente',
        data: pedido
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para errores del servicio
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Estado inválido') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 7. Actualizar Pedido (PUT /api/pedidos/:id) ---

  /**
   * Maneja la petición para actualizar campos generales de un pedido.
   */
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/pedidos/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la actualización al servicio
      const pedido = await PedidoService.actualizar(req.params.id, req.body);

      console.log('✅ RESPUESTA EXITOSA: Pedido actualizado');
      console.log('==========================================\n');

      res.json({
        success: true,
        message: 'Pedido actualizado exitosamente',
        data: pedido
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para 'Pedido no encontrado'
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 8. Cancelar Pedido (DELETE /api/pedidos/:id) ---

  /**
   * Maneja la petición para cancelar un pedido (soft delete o cambio de estado a 'cancelado').
   */
  static async cancelar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/pedidos/${req.params.id}`);

      // Delega la cancelación al servicio
      const resultado = await PedidoService.cancelar(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Pedido cancelado');
      console.log('==========================================\n');

      res.json({
        success: true,
        message: 'Pedido cancelado exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para 'Pedido no encontrado'
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      // Manejo específico para la lógica de negocio (ej: no se puede cancelar un pedido ya entregado)
      if (error.message.includes('Solo se pueden cancelar')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
}

// Exporta el controlador para ser utilizado por el router
module.exports = PedidoController;