const UsuarioService = require('../services/usuario.service');

class UsuarioController {
  
  // GET /api/usuarios
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/usuarios');
      console.log('👤 Usuario autenticado:', req.usuario.email);
      
      const usuarios = await UsuarioService.obtenerTodos();
      
      console.log('✅ RESPUESTA EXITOSA:', usuarios.length, 'usuarios encontrados');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        count: usuarios.length,
        data: usuarios
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/usuarios/:id
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/usuarios/${req.params.id}`);
      
      const usuario = await UsuarioService.obtenerPorId(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Usuario encontrado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        data: usuario
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // PUT /api/usuarios/:id
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/usuarios/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const usuario = await UsuarioService.actualizar(req.params.id, req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Usuario actualizado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: usuario
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // DELETE /api/usuarios/:id
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/usuarios/${req.params.id}`);
      
      const resultado = await UsuarioService.eliminar(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Usuario eliminado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
        data: resultado
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }
}

module.exports = UsuarioController;