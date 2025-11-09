const { db } = require('../../config/firebase');

const COLECCION = 'pedidos';

class PedidoModel {
  
  static async crear(datosPedido) {
    try {
      const pedidoRef = db.collection(COLECCION).doc();
      
      const nuevoPedido = {
        id: pedidoRef.id,
        clienteId: datosPedido.clienteId,
        usuarioId: datosPedido.usuarioId,
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        items: datosPedido.items,
        subtotal: datosPedido.subtotal,
        descuento: datosPedido.descuento || 0,
        total: datosPedido.total,
        metodoPago: datosPedido.metodoPago,
        observaciones: datosPedido.observaciones || '',
        direccionEntrega: datosPedido.direccionEntrega
      };
      
      await pedidoRef.set(nuevoPedido);
      return nuevoPedido;
      
    } catch (error) {
      throw new Error(`Error al crear pedido: ${error.message}`);
    }
  }

  static async obtenerTodos() {
    try {
      const snapshot = await db.collection(COLECCION)
        .orderBy('fecha', 'desc')
        .get();
      
      const pedidos = [];
      snapshot.forEach(doc => pedidos.push(doc.data()));
      
      return pedidos;
      
    } catch (error) {
      throw new Error(`Error al obtener pedidos: ${error.message}`);
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
      throw new Error(`Error al obtener pedido: ${error.message}`);
    }
  }

  static async obtenerPorCliente(clienteId) {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('clienteId', '==', clienteId)
        .orderBy('fecha', 'desc')
        .get();
      
      const pedidos = [];
      snapshot.forEach(doc => pedidos.push(doc.data()));
      
      return pedidos;
      
    } catch (error) {
      throw new Error(`Error al obtener pedidos del cliente: ${error.message}`);
    }
  }

  static async obtenerPorEstado(estado) {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('estado', '==', estado)
        .orderBy('fecha', 'desc')
        .get();
      
      const pedidos = [];
      snapshot.forEach(doc => pedidos.push(doc.data()));
      
      return pedidos;
      
    } catch (error) {
      throw new Error(`Error al obtener pedidos por estado: ${error.message}`);
    }
  }

  static async actualizar(id, datosActualizados) {
    try {
      const pedidoRef = db.collection(COLECCION).doc(id);
      const doc = await pedidoRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await pedidoRef.update(datosActualizados);
      return await this.obtenerPorId(id);
      
    } catch (error) {
      throw new Error(`Error al actualizar pedido: ${error.message}`);
    }
  }

  static async cambiarEstado(id, nuevoEstado) {
    try {
      const pedidoRef = db.collection(COLECCION).doc(id);
      const doc = await pedidoRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await pedidoRef.update({ 
        estado: nuevoEstado,
        fechaActualizacion: new Date().toISOString()
      });
      
      return await this.obtenerPorId(id);
      
    } catch (error) {
      throw new Error(`Error al cambiar estado del pedido: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      const pedidoRef = db.collection(COLECCION).doc(id);
      const doc = await pedidoRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      // Cambiar estado a cancelado en lugar de eliminar
      await pedidoRef.update({ 
        estado: 'cancelado',
        fechaCancelacion: new Date().toISOString()
      });
      
      return { id, cancelado: true };
      
    } catch (error) {
      throw new Error(`Error al cancelar pedido: ${error.message}`);
    }
  }
}

module.exports = PedidoModel;