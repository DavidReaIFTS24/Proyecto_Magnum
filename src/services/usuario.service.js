const UsuarioModel = require('../models/usuario.model');
const jwt = require('jsonwebtoken');

class UsuarioService {
  
  static async registrarUsuario(datosUsuario) {
    console.log('📝 Servicio: Registrando nuevo usuario...');
    
    // Validar que el email no exista
    const usuarioExistente = await UsuarioModel.obtenerPorEmail(datosUsuario.email);
    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }
    
    const usuario = await UsuarioModel.crear(datosUsuario);
    console.log(`✅ Usuario registrado: ${usuario.email}`);
    
    return usuario;
  }

  static async login(email, password) {
    console.log('🔐 Servicio: Procesando login...');
    
    const usuario = await UsuarioModel.obtenerPorEmail(email);
    
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }
    
    if (!usuario.activo) {
      throw new Error('Usuario inactivo');
    }
    
    const passwordValido = await UsuarioModel.verificarPassword(password, usuario.password);
    
    if (!passwordValido) {
      throw new Error('Credenciales inválidas');
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    // Actualizar último acceso
    await UsuarioModel.actualizarUltimoAcceso(usuario.id);
    
    console.log(`✅ Login exitoso: ${usuario.email} (${usuario.rol})`);
    
    // No devolver password
    delete usuario.password;
    
    return { usuario, token };
  }

  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los usuarios...');
    const usuarios = await UsuarioModel.obtenerTodos();
    console.log(`✅ ${usuarios.length} usuarios encontrados`);
    return usuarios;
  }

  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando usuario ${id}...`);
    const usuario = await UsuarioModel.obtenerPorId(id);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    console.log(`✅ Usuario encontrado: ${usuario.email}`);
    return usuario;
  }

  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando usuario ${id}...`);
    
    // No permitir cambiar el email a uno ya existente
    if (datosActualizados.email) {
      const usuarioConEmail = await UsuarioModel.obtenerPorEmail(datosActualizados.email);
      if (usuarioConEmail && usuarioConEmail.id !== id) {
        throw new Error('El email ya está en uso');
      }
    }
    
    const usuario = await UsuarioModel.actualizar(id, datosActualizados);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    console.log(`✅ Usuario actualizado: ${usuario.email}`);
    return usuario;
  }

  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando usuario ${id}...`);
    
    const resultado = await UsuarioModel.eliminar(id);
    
    if (!resultado) {
      throw new Error('Usuario no encontrado');
    }
    
    console.log(`✅ Usuario eliminado: ${id}`);
    return resultado;
  }
}

module.exports = UsuarioService;