const UsuarioService = require('../services/usuario.service');

class AuthController {
  
  // POST /api/auth/register
  static async registrar(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/auth/register');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const usuario = await UsuarioService.registrarUsuario(req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Usuario registrado');
      console.log('==========================================\n');
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: usuario
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // POST /api/auth/login
  static async login(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/auth/login');
      console.log('📦 Body recibido:', JSON.stringify({ email: req.body.email, password: '***' }));
      
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new Error('Email y password son requeridos');
      }
      
      const resultado = await UsuarioService.login(email, password);
      
      console.log('✅ RESPUESTA EXITOSA: Login exitoso');
      console.log('🔑 Token generado para:', resultado.usuario.email);
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Login exitoso',
        data: resultado
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/auth/perfil
  static async obtenerPerfil(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/auth/perfil');
      console.log('👤 Usuario autenticado:', req.usuario.email);
      
      const usuario = await UsuarioService.obtenerPorId(req.usuario.id);
      
      console.log('✅ RESPUESTA EXITOSA: Perfil obtenido');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        data: usuario
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }
}

module.exports = AuthController;