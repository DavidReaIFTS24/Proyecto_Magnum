const { db } = require('../../config/firebase');

const COLECCION = 'clientes';

class ClienteModel {
  
  static async crear(datosCliente) {
    try {
      const clienteRef = db.collection(COLECCION).doc();
      
      const nuevoCliente = {
        id: clienteRef.id,
        nombre: datosCliente.nombre,
        email: datosCliente.email.toLowerCase(),
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion || '',
        dni: datosCliente.dni,
        fechaRegistro: new Date().toISOString(),
        activo: true
      };
      
      await clienteRef.set(nuevoCliente);
      return nuevoCliente;
      
    } catch (error) {
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  static async obtenerTodos() {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('activo', '==', true)
        .get();
      
      const clientes = [];
      snapshot.forEach(doc => clientes.push(doc.data()));
      
      return clientes;
      
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  static async obtenerPorId(id) {
    try {
      const doc = await db.collection(COLECCION).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return doc.data();
      
    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  static async obtenerPorDni(dni) {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('dni', '==', dni)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      return snapshot.docs[0].data();
      
    } catch (error) {
      throw new Error(`Error al buscar cliente: ${error.message}`);
    }
  }

  static async actualizar(id, datosActualizados) {
    try {
      const clienteRef = db.collection(COLECCION).doc(id);
      const doc = await clienteRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      if (datosActualizados.email) {
        datosActualizados.email = datosActualizados.email.toLowerCase();
      }
      
      await clienteRef.update(datosActualizados);
      return await this.obtenerPorId(id);
      
    } catch (error) {
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      const clienteRef = db.collection(COLECCION).doc(id);
      const doc = await clienteRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await clienteRef.update({ activo: false });
      return { id, eliminado: true };
      
    } catch (error) {
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }
}

module.exports = ClienteModel;