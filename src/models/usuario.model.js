const { db } = require('../../config/firebase');
const bcrypt = require('bcryptjs');

const COLECCION = 'usuarios';

class UsuarioModel {
  
  // Crear usuario
  static async crear(datosUsuario) {
    try {
      const usuarioRef = db.collection(COLECCION).doc();
      
      // Hashear password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(datosUsuario.password, salt);
      
      const nuevoUsuario = {
        id: usuarioRef.id,
        nombre: datosUsuario.nombre,
        email: datosUsuario.email.toLowerCase(),
        password: passwordHash,
        rol: datosUsuario.rol || 'empleado',
        activo: true,
        fechaCreacion: new Date().toISOString(),
        ultimoAcceso: null
      };
      
      await usuarioRef.set(nuevoUsuario);
      
      // No devolver password
      delete nuevoUsuario.password;
      return nuevoUsuario;
      
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  // Obtener todos los usuarios
  static async obtenerTodos() {
    try {
      const snapshot = await db.collection(COLECCION).get();
      const usuarios = [];
      
      snapshot.forEach(doc => {
        const usuario = doc.data();
        delete usuario.password; // No devolver passwords
        usuarios.push(usuario);
      });
      
      return usuarios;
      
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  // Obtener usuario por ID
  static async obtenerPorId(id) {
    try {
      const doc = await db.collection(COLECCION).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const usuario = doc.data();
      delete usuario.password;
      return usuario;
      
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  // Obtener usuario por email (para login)
  static async obtenerPorEmail(email) {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      return snapshot.docs[0].data();
      
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Actualizar usuario
  static async actualizar(id, datosActualizados) {
    try {
      const usuarioRef = db.collection(COLECCION).doc(id);
      const doc = await usuarioRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      // Si se actualiza password, hashearlo
      if (datosActualizados.password) {
        const salt = await bcrypt.genSalt(10);
        datosActualizados.password = await bcrypt.hash(datosActualizados.password, salt);
      }
      
      await usuarioRef.update(datosActualizados);
      
      const usuarioActualizado = await this.obtenerPorId(id);
      return usuarioActualizado;
      
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  // Eliminar usuario (soft delete)
  static async eliminar(id) {
    try {
      const usuarioRef = db.collection(COLECCION).doc(id);
      const doc = await usuarioRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await usuarioRef.update({ activo: false });
      return { id, eliminado: true };
      
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // Verificar password
  static async verificarPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  // Actualizar último acceso
  static async actualizarUltimoAcceso(id) {
    try {
      await db.collection(COLECCION).doc(id).update({
        ultimoAcceso: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al actualizar último acceso:', error);
    }
  }
}

module.exports = UsuarioModel;