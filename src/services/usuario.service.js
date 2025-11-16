// Importa el modelo de usuario, que interactúa con la base de datos
const UsuarioModel = require('../models/usuario.model');
// Importa la librería JSON Web Token para la generación y verificación de tokens
const jwt = require('jsonwebtoken');

// Define la clase de servicio que contendrá la lógica de negocio para los usuarios
class UsuarioService {

  /**
   * Método estático para registrar un nuevo usuario.
   * @param {object} datosUsuario - Objeto con la información del nuevo usuario (ej: email, password, nombre).
   * @returns {object} El objeto del usuario registrado (sin la contraseña).
   */
  static async registrarUsuario(datosUsuario) {
    console.log('📝 Servicio: Registrando nuevo usuario...');

    // 1. Validar que el email no exista en la base de datos
    const usuarioExistente = await UsuarioModel.obtenerPorEmail(datosUsuario.email);
    if (usuarioExistente) {
      // Si se encuentra un usuario con ese email, lanza un error
      throw new Error('El email ya está registrado');
    }

    // 2. Si el email es único, crea el nuevo usuario en la base de datos
    // Se asume que UsuarioModel.crear() hashea la contraseña antes de guardarla
    const usuario = await UsuarioModel.crear(datosUsuario);
    console.log(`✅ Usuario registrado: ${usuario.email}`);

    // Devuelve el objeto del usuario recién creado
    return usuario;
  }

  /**
   * Método estático para iniciar sesión de un usuario.
   * @param {string} email - El email del usuario.
   * @param {string} password - La contraseña proporcionada por el usuario.
   * @returns {object} Un objeto que contiene el objeto del usuario (sin password) y el token JWT.
   */
  static async login(email, password) {
    console.log('🔐 Servicio: Procesando login...');

    // 1. Busca al usuario en la base de datos por su email
    const usuario = await UsuarioModel.obtenerPorEmail(email);

    // 2. Verifica si el usuario existe
    if (!usuario) {
      // Si no existe, lanza un error de credenciales inválidas (por seguridad, el mensaje es genérico)
      throw new Error('Credenciales inválidas');
    }

    // 3. Verifica si la cuenta del usuario está activa
    if (!usuario.activo) {
      // Si no está activo, lanza un error específico
      throw new Error('Usuario inactivo');
    }

    // 4. Verifica si la contraseña proporcionada coincide con la contraseña hasheada almacenada
    // Se asume que UsuarioModel.verificarPassword() usa bcrypt o similar
    const passwordValido = await UsuarioModel.verificarPassword(password, usuario.password);

    if (!passwordValido) {
      // Si la contraseña no es válida, lanza un error de credenciales inválidas
      throw new Error('Credenciales inválidas');
    }

    // 5. Genera un token JWT si el login es exitoso
    const token = jwt.sign(
      {
        // Payload: datos que se codificarán en el token
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      // Clave secreta para firmar el token, tomada de las variables de entorno
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Configura la expiración del token (ej: 8 horas)
    );

    // 6. Actualiza la fecha y hora del último acceso del usuario en la base de datos
    await UsuarioModel.actualizarUltimoAcceso(usuario.id);

    console.log(`✅ Login exitoso: ${usuario.email} (${usuario.rol})`);

    // 7. **IMPORTANTE:** Elimina la propiedad 'password' del objeto usuario antes de devolverlo
    delete usuario.password;

    // 8. Devuelve el objeto del usuario (sin password) junto con el token
    return { usuario, token };
  }

  /**
   * Método estático para obtener la lista de todos los usuarios.
   * @returns {array} Un array con todos los objetos de usuario.
   */
  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los usuarios...');
    // Llama al método del modelo para obtener todos los usuarios
    const usuarios = await UsuarioModel.obtenerTodos();
    console.log(`✅ ${usuarios.length} usuarios encontrados`);
    return usuarios;
  }

  /**
   * Método estático para obtener un usuario por su ID.
   * @param {number|string} id - El ID único del usuario.
   * @returns {object} El objeto del usuario encontrado.
   */
  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando usuario ${id}...`);
    // Busca el usuario por ID
    const usuario = await UsuarioModel.obtenerPorId(id);

    // Si el usuario no es encontrado, lanza un error
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    console.log(`✅ Usuario encontrado: ${usuario.email}`);
    return usuario;
  }

  /**
   * Método estático para actualizar la información de un usuario.
   * @param {number|string} id - El ID del usuario a actualizar.
   * @param {object} datosActualizados - Objeto con los campos y nuevos valores a actualizar.
   * @returns {object} El objeto del usuario actualizado.
   */
  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando usuario ${id}...`);

    // 1. Lógica de validación para evitar que el email se cambie a uno ya existente por otro usuario
    if (datosActualizados.email) {
      // Busca si ya existe otro usuario con el nuevo email
      const usuarioConEmail = await UsuarioModel.obtenerPorEmail(datosActualizados.email);
      // Si existe y su ID es diferente al usuario que estamos actualizando, lanza un error
      if (usuarioConEmail && usuarioConEmail.id !== id) {
        throw new Error('El email ya está en uso');
      }
    }

    // 2. Realiza la actualización en la base de datos
    const usuario = await UsuarioModel.actualizar(id, datosActualizados);

    // 3. Verifica si la actualización fue exitosa (si el usuario existía)
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    console.log(`✅ Usuario actualizado: ${usuario.email}`);
    return usuario;
  }

  /**
   * Método estático para eliminar un usuario.
   * @param {number|string} id - El ID del usuario a eliminar.
   * @returns {boolean} True si la eliminación fue exitosa.
   */
  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando usuario ${id}...`);

    // Llama al método del modelo para eliminar el usuario
    // Se asume que retorna true o el número de filas afectadas si se eliminó, o false/0 si no se encontró
    const resultado = await UsuarioModel.eliminar(id);

    // Si el resultado indica que el usuario no fue eliminado (no fue encontrado)
    if (!resultado) {
      throw new Error('Usuario no encontrado');
    }

    console.log(`✅ Usuario eliminado: ${id}`);
    return resultado;
  }
}

// Exporta la clase de servicio para que pueda ser utilizada por los controladores
module.exports = UsuarioService;