// Importa el servicio de usuario que contiene la lógica de negocio para la autenticación
const UsuarioService = require('../services/usuario.service');

// Define la clase de controlador de autenticación
class AuthController {

  // --- 1. Registrar Nuevo Usuario (POST /api/auth/register) ---

  /**
   * Maneja la petición de registro de un nuevo usuario.
   */
  static async registrar(req, res, next) {
    try {
      // Registro de la petición entrante
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/auth/register');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la creación del usuario (incluyendo hasheo de contraseña) al servicio
      const usuario = await UsuarioService.registrarUsuario(req.body);

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA: Usuario registrado');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente con código 201 Created
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        // Nota: El servicio debe asegurarse de no devolver la contraseña hasheada
        data: usuario 
      });

    } catch (error) {
      // Captura y pasa el error al middleware global de manejo de errores
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error); 
    }
  }

  // --- 2. Iniciar Sesión (POST /api/auth/login) ---

  /**
   * Maneja la petición de inicio de sesión.
   * Si es exitoso, devuelve el token JWT y la información del usuario.
   */
  static async login(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/auth/login');
      // Ocultar la contraseña en el log de la petición por seguridad
      console.log('📦 Body recibido:', JSON.stringify({ email: req.body.email, password: '***' }));

      const { email, password } = req.body;

      // Validación inicial de campos requeridos
      if (!email || !password) {
        // Lanza un error para que sea capturado por el bloque catch y manejado por el errorHandler
        throw new Error('Email y password son requeridos');
      }

      // Delega la autenticación (verificación de credenciales y generación de token) al servicio
      const resultado = await UsuarioService.login(email, password);

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA: Login exitoso');
      console.log('🔑 Token generado para:', resultado.usuario.email);
      console.log('==========================================\n');

      // Envía el token y el usuario al cliente
      res.json({
        success: true,
        message: 'Login exitoso',
        data: resultado // Contiene { token, usuario }
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 3. Obtener Perfil del Usuario (GET /api/auth/perfil) ---

  /**
   * Maneja la petición para obtener la información del usuario autenticado.
   * Esta ruta REQUIERE el middleware 'verificarToken' para adjuntar req.usuario.
   */
  static async obtenerPerfil(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/auth/perfil');
      // req.usuario es llenado por el middleware de autenticación (verificarToken)
      console.log('👤 Usuario autenticado:', req.usuario.email); 

      // Busca la información completa del usuario usando el ID del payload del token
      const usuario = await UsuarioService.obtenerPorId(req.usuario.id);

      console.log('✅ RESPUESTA EXITOSA: Perfil obtenido');
      console.log('==========================================\n');

      // Envía la información del perfil
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

// Exporta el controlador para ser utilizado por el router
module.exports = AuthController;