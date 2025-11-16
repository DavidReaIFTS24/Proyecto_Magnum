// Importa la instancia de la base de datos de Firebase (Firestore)
const { db } = require('../../config/firebase');

// Define el nombre de la colección en Firestore donde se almacenarán los pedidos
const COLECCION = 'pedidos';

// Define la clase que contiene los métodos para interactuar con la colección de pedidos
class PedidoModel {

  /**
   * Método para crear un nuevo registro de pedido en Firestore.
   * Inicializa el estado como 'pendiente' y registra la fecha de creación.
   * @param {object} datosPedido - Datos del pedido (clienteId, items, totales, etc.).
   * @returns {object} El objeto del pedido creado.
   */
  static async crear(datosPedido) {
    try {
      // 1. Obtiene una referencia a un nuevo documento, generando automáticamente un ID único
      const pedidoRef = db.collection(COLECCION).doc();

      // 2. Define la estructura del nuevo documento/pedido, con valores por defecto
      const nuevoPedido = {
        id: pedidoRef.id, // Usa el ID generado por Firestore
        clienteId: datosPedido.clienteId,
        usuarioId: datosPedido.usuarioId,
        fecha: new Date().toISOString(), // Marca de tiempo de creación
        estado: 'pendiente', // Estado inicial por defecto
        items: datosPedido.items, // Array de productos y cantidades compradas
        subtotal: datosPedido.subtotal,
        descuento: datosPedido.descuento || 0, // Descuento por defecto es 0
        total: datosPedido.total,
        metodoPago: datosPedido.metodoPago,
        observaciones: datosPedido.observaciones || '', // Observaciones opcionales
        direccionEntrega: datosPedido.direccionEntrega
      };

      // 3. Escribe el nuevo documento en Firestore
      await pedidoRef.set(nuevoPedido);
      return nuevoPedido;

    } catch (error) {
      // Captura y relanza cualquier error
      throw new Error(`Error al crear pedido: ${error.message}`);
    }
  }

  /**
   * Método para obtener todos los pedidos, ordenados por fecha de forma descendente.
   * @returns {array} Un array de objetos de pedido.
   */
  static async obtenerTodos() {
    try {
      // Obtiene todos los documentos y los ordena por fecha descendente (más recientes primero)
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

  /**
   * Método para obtener un pedido por su ID de documento en Firestore.
   * @param {string} id - El ID único del documento.
   * @returns {object|null} El objeto del pedido o null si no existe.
   */
  static async obtenerPorId(id) {
    try {
      // Obtiene un documento específico por su ID
      const doc = await db.collection(COLECCION).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return doc.data();

    } catch (error) {
      throw new Error(`Error al obtener pedido: ${error.message}`);
    }
  }

  /**
   * Método para obtener pedidos filtrados por el ID del cliente.
   * Los resultados se ordenan por fecha descendente.
   * @param {string} clienteId - El ID del cliente a filtrar.
   * @returns {array} Un array de pedidos realizados por ese cliente.
   */
  static async obtenerPorCliente(clienteId) {
    try {
      // Consulta filtrando por 'clienteId' y ordenando por 'fecha'
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

  /**
   * Método para obtener pedidos filtrados por su estado (ej: 'enviado', 'entregado').
   * Los resultados se ordenan por fecha descendente.
   * @param {string} estado - El estado del pedido a filtrar.
   * @returns {array} Un array de pedidos con el estado solicitado.
   */
  static async obtenerPorEstado(estado) {
    try {
      // Consulta filtrando por 'estado' y ordenando por 'fecha'
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

  /**
   * Método para actualizar campos de un pedido por su ID.
   * @param {string} id - El ID del pedido a actualizar.
   * @param {object} datosActualizados - Los campos a modificar.
   * @returns {object|null} El objeto del pedido actualizado o null.
   */
  static async actualizar(id, datosActualizados) {
    try {
      const pedidoRef = db.collection(COLECCION).doc(id);
      const doc = await pedidoRef.get();

      if (!doc.exists) {
        return null;
      }

      // Realiza la actualización parcial del documento
      await pedidoRef.update(datosActualizados);
      
      // Retorna el objeto actualizado
      return await this.obtenerPorId(id);

    } catch (error) {
      throw new Error(`Error al actualizar pedido: ${error.message}`);
    }
  }

  /**
   * Método específico para cambiar el estado de un pedido.
   * Registra la fecha de actualización junto con el nuevo estado.
   * @param {string} id - El ID del pedido.
   * @param {string} nuevoEstado - El nuevo estado a asignar.
   * @returns {object|null} El pedido actualizado o null.
   */
  static async cambiarEstado(id, nuevoEstado) {
    try {
      const pedidoRef = db.collection(COLECCION).doc(id);
      const doc = await pedidoRef.get();

      if (!doc.exists) {
        return null;
      }

      // Actualiza el campo 'estado' y la marca de tiempo de 'fechaActualizacion'
      await pedidoRef.update({ 
        estado: nuevoEstado,
        fechaActualizacion: new Date().toISOString()
      });
      
      return await this.obtenerPorId(id);

    } catch (error) {
      throw new Error(`Error al cambiar estado del pedido: ${error.message}`);
    }
  }

  /**
   * Método para "eliminar" un pedido realizando un soft delete (cambiando su estado a 'cancelado').
   * @param {string} id - El ID del pedido a "eliminar".
   * @returns {object|null} Un objeto de confirmación o null si no se encontró.
   */
  static async eliminar(id) {
    try {
      const pedidoRef = db.collection(COLECCION).doc(id);
      const doc = await pedidoRef.get();

      if (!doc.exists) {
        return null;
      }

      // Implementa el soft delete marcando el estado como 'cancelado'
      await pedidoRef.update({ 
        estado: 'cancelado',
        fechaCancelacion: new Date().toISOString() // Registra la fecha de cancelación
      });
      
      return { id, cancelado: true };

    } catch (error) {
      // Nota: A pesar de llamarse 'eliminar', este método realiza una cancelación (soft delete)
      throw new Error(`Error al cancelar pedido: ${error.message}`);
    }
  }
}

// Exporta el modelo para ser utilizado por la capa de servicios
module.exports = PedidoModel;