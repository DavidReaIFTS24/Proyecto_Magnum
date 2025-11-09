const PedidoService = require('../services/pedido.service');

class PedidoController {
  
  // POST /api/pedidos
  static async crear(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/pedidos');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      console.log('👤 Usuario que crea el pedido:', req.usuario.email);
      
      const pedido = await PedidoService.crear(req.body, req.usuario.id);
      
      console.log('✅ RESPUESTA EXITOSA: Pedido creado');
      console.log('==========================================\n');
      
      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        data: pedido
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message.includes('Stock insuficiente')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // GET /api/pedidos
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/pedidos');
      
      const pedidos = await PedidoService.obtenerTodos();
      
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

  // GET /api/pedidos/:id
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/pedidos/${req.params.id}`);
      
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
      
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // GET /api/pedidos/cliente/:clienteId
  static async obtenerPorCliente(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/pedidos/cliente/${req.params.clienteId}`);
      
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

  // GET /api/pedidos/estado/:estado
  static async obtenerPorEstado(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/pedidos/estado/${req.params.estado}`);
      
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

  // PUT /api/pedidos/:id/estado
  static async cambiarEstado(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/pedidos/${req.params.id}/estado`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const { estado } = req.body;
      
      if (!estado) {
        return res.status(400).json({
          success: false,
          message: 'El estado es requerido'
        });
      }
      
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

  // PUT /api/pedidos/:id
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/pedidos/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
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
      
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // DELETE /api/pedidos/:id
  static async cancelar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/pedidos/${req.params.id}`);
      
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
      
      if (error.message === 'Pedido no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
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

module.exports = PedidoController;