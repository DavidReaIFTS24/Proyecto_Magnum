// Importa la instancia de la base de datos de Firebase (Firestore)
const { db } = require('../../config/firebase');
// Importa la librería bcryptjs para hashear y verificar contraseñas de forma segura
const bcrypt = require('bcryptjs');

// Define el nombre de la colección en Firestore donde se almacenarán los usuarios
const COLECCION = 'usuarios';

// Define la clase que contiene los métodos para interactuar con la colección de usuarios
class UsuarioModel {

  /**
   * Método para crear un nuevo registro de usuario en Firestore.
   * Realiza el hasheo de la contraseña antes de guardarla.
   * @param {object} datosUsuario - Datos del usuario a crear.
   * @returns {object} El objeto del usuario creado (sin la contraseña hasheada).
   */
  static async crear(datosUsuario) {
    try {
      // 1. Obtiene una referencia a un nuevo documento, generando automáticamente un ID único
      const usuarioRef = db.collection(COLECCION).doc();

      // 2. Seguridad: Generar un salt (cadena aleatoria) y hashear la contraseña
      const salt = await bcrypt.genSalt(10); // Genera un salt con factor de coste 10
      const passwordHash = await bcrypt.hash(datosUsuario.password, salt); // Hashea la contraseña

      // 3. Define la estructura del nuevo documento/usuario
      const nuevoUsuario = {
        id: usuarioRef.id, // Usa el ID generado por Firestore como ID del documento
        nombre: datosUsuario.nombre,
        email: datosUsuario.email.toLowerCase(), // Almacena el email en minúsculas para búsquedas consistentes
        password: passwordHash, // Guarda la contraseña hasheada
        rol: datosUsuario.rol || 'empleado', // Asigna rol por defecto si no se especifica
        activo: true, // Por defecto, el usuario está activo
        fechaCreacion: new Date().toISOString(), // Guarda la fecha de creación en formato ISO
        ultimoAcceso: null // Inicializa la fecha del último acceso
      };

      // 4. Escribe el nuevo documento en Firestore
      await usuarioRef.set(nuevoUsuario);

      // 5. Antes de devolver, elimina la contraseña hasheada del objeto de respuesta
      delete nuevoUsuario.password;
      return nuevoUsuario;

    } catch (error) {
      // Captura y relanza cualquier error ocurrido durante la operación
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Método para obtener todos los documentos de la colección de usuarios.
   * @returns {array} Un array de objetos de usuario (sin contraseñas).
   */
  static async obtenerTodos() {
    try {
      // Obtiene una "instantánea" de todos los documentos en la colección
      const snapshot = await db.collection(COLECCION).get();
      const usuarios = [];

      // Itera sobre cada documento en la instantánea
      snapshot.forEach(doc => {
        const usuario = doc.data(); // Obtiene los datos del documento
        delete usuario.password; // Limpia la contraseña
        usuarios.push(usuario); // Agrega el usuario limpio al array
      });

      return usuarios;

    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  /**
   * Método para obtener un usuario por su ID de documento en Firestore.
   * @param {string} id - El ID único del documento.
   * @returns {object|null} El objeto del usuario (sin contraseña) o null si no existe.
   */
  static async obtenerPorId(id) {
    try {
      // Obtiene un documento específico por su ID
      const doc = await db.collection(COLECCION).doc(id).get();

      // Si el documento no existe, retorna null
      if (!doc.exists) {
        return null;
      }

      // Obtiene los datos, elimina la contraseña y retorna el usuario
      const usuario = doc.data();
      delete usuario.password;
      return usuario;

    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Método para obtener un usuario por su email.
   * Se utiliza principalmente durante el proceso de login.
   * @param {string} email - El email del usuario a buscar.
   * @returns {object|null} El objeto completo del usuario (INCLUYE la contraseña hasheada) o null.
   */
  static async obtenerPorEmail(email) {
    try {
      // Realiza una consulta (query) filtrando por el campo 'email'
      const snapshot = await db.collection(COLECCION)
        .where('email', '==', email.toLowerCase()) // Busca por email en minúsculas
        .limit(1) // Limita la respuesta a un solo documento (ya que el email debe ser único)
        .get();

      // Si la consulta no devuelve resultados, retorna null
      if (snapshot.empty) {
        return null;
      }

      // Retorna los datos del primer (y único) documento encontrado.
      // IMPORTANTE: Este método DEBE devolver la contraseña hasheada para que el servicio pueda verificarla.
      return snapshot.docs[0].data();

    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  /**
   * Método para actualizar los datos de un usuario.
   * Si se incluye la contraseña, la hashea antes de guardarla.
   * @param {string} id - El ID del usuario a actualizar.
   * @param {object} datosActualizados - Los campos a modificar.
   * @returns {object|null} El objeto del usuario actualizado (sin contraseña) o null.
   */
  static async actualizar(id, datosActualizados) {
    try {
      const usuarioRef = db.collection(COLECCION).doc(id);
      const doc = await usuarioRef.get();

      if (!doc.exists) {
        return null; // El usuario no existe
      }

      // Lógica condicional: Si se actualiza el password, debe hashearse
      if (datosActualizados.password) {
        const salt = await bcrypt.genSalt(10);
        datosActualizados.password = await bcrypt.hash(datosActualizados.password, salt);
      }
      
      // Si el email se actualiza, se asegura que esté en minúsculas
      if (datosActualizados.email) {
          datosActualizados.email = datosActualizados.email.toLowerCase();
      }

      // Realiza la actualización parcial del documento
      await usuarioRef.update(datosActualizados);

      // Obtiene el usuario actualizado (sin password) para retornarlo
      const usuarioActualizado = await this.obtenerPorId(id);
      return usuarioActualizado;

    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Método para "eliminar" un usuario realizando un soft delete (marcarlo como inactivo).
   * @param {string} id - El ID del usuario a eliminar.
   * @returns {object|null} Un objeto de confirmación o null si no se encontró el usuario.
   */
  static async eliminar(id) {
    try {
      const usuarioRef = db.collection(COLECCION).doc(id);
      const doc = await usuarioRef.get();

      if (!doc.exists) {
        return null; // El usuario no existe
      }

      // Realiza un soft delete: actualiza el campo 'activo' a false
      await usuarioRef.update({ activo: false });
      return { id, eliminado: true };

    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Método para comparar una contraseña plana con una contraseña hasheada almacenada.
   * Utilizado en el proceso de login.
   * @param {string} password - Contraseña en texto plano.
   * @param {string} passwordHash - Contraseña hasheada almacenada en la DB.
   * @returns {boolean} True si coinciden, false en caso contrario.
   */
  static async verificarPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  /**
   * Método auxiliar para actualizar la marca de tiempo del último acceso.
   * @param {string} id - El ID del usuario.
   */
  static async actualizarUltimoAcceso(id) {
    try {
      // Actualiza solo el campo 'ultimoAcceso'
      await db.collection(COLECCION).doc(id).update({
        ultimoAcceso: new Date().toISOString()
      });
    } catch (error) {
      // Este error es menos crítico, solo se registra en consola
      console.error('Error al actualizar último acceso:', error);
    }
  }
}

// Exporta el modelo para ser utilizado por la capa de servicios
module.exports = UsuarioModel;