const ClienteService = require('../services/cliente.service');

class ClienteController {
  
  // POST /api/clientes
  static async crear(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/clientes');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const cliente = await ClienteService.crear(req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Cliente creado');
      console.log('==========================================\n');
      
      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: cliente
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/clientes
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/clientes');
      
      const clientes = await ClienteService.obtenerTodos();
      
      console.log('✅ RESPUESTA EXITOSA:', clientes.length, 'clientes encontrados');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        count: clientes.length,
        data: clientes
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/clientes/:id
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/clientes/${req.params.id}`);
      
      const cliente = await ClienteService.obtenerPorId(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Cliente encontrado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        data: cliente
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // PUT /api/clientes/:id
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/clientes/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const cliente = await ClienteService.actualizar(req.params.id, req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Cliente actualizado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: cliente
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // DELETE /api/clientes/:id
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/clientes/${req.params.id}`);
      
      const resultado = await ClienteService.eliminar(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Cliente eliminado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Cliente eliminado exitosamente',
        data: resultado
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }
}

module.exports = ClienteController;