// Importa la instancia de la base de datos de Firebase (Firestore)
const { db } = require('../../config/firebase');

// Define el nombre de la colección en Firestore donde se almacenará el stock
const COLECCION = 'stock';

// Define la clase que contiene los métodos para interactuar con la colección de stock
class StockModel {

  /**
   * Método para crear un nuevo registro de stock.
   * Inicializa la cantidad, ubicación y stock mínimo si no se proporcionan.
   * @param {object} datosStock - Datos del stock a crear (productoId es obligatorio).
   * @returns {object} El objeto del stock creado.
   */
  static async crear(datosStock) {
    try {
      // 1. Obtiene una referencia a un nuevo documento, generando automáticamente un ID único
      const stockRef = db.collection(COLECCION).doc();

      // 2. Define la estructura del nuevo documento, con valores por defecto
      const nuevoStock = {
        id: stockRef.id,
        productoId: datosStock.productoId,
        cantidad: datosStock.cantidad || 0, // Stock inicial por defecto es 0
        ubicacion: datosStock.ubicacion || '',
        stockMinimo: datosStock.stockMinimo || 5, // Umbral de stock bajo por defecto es 5
        ultimaActualizacion: new Date().toISOString() // Marca de tiempo de creación
      };

      // 3. Escribe el nuevo documento en Firestore
      await stockRef.set(nuevoStock);
      return nuevoStock;

    } catch (error) {
      // Captura y relanza cualquier error
      throw new Error(`Error al crear stock: ${error.message}`);
    }
  }

  /**
   * Método para obtener todos los registros de stock.
   * @returns {array} Un array de objetos de stock.
   */
  static async obtenerTodos() {
    try {
      const snapshot = await db.collection(COLECCION).get();

      const stocks = [];
      // Itera y añade los datos de cada documento al array
      snapshot.forEach(doc => stocks.push(doc.data()));

      return stocks;

    } catch (error) {
      throw new Error(`Error al obtener stocks: ${error.message}`);
    }
  }

  /**
   * Método para obtener un registro de stock por su ID de documento.
   * @param {string} id - El ID único del documento de stock.
   * @returns {object|null} El objeto de stock o null si no existe.
   */
  static async obtenerPorId(id) {
    try {
      const doc = await db.collection(COLECCION).doc(id).get();

      if (!doc.exists) {
        return null; // Retorna null si el documento no existe
      }

      return doc.data(); // Retorna los datos del documento

    } catch (error) {
      throw new Error(`Error al obtener stock: ${error.message}`);
    }
  }

  /**
   * Método para obtener el registro de stock asociado a un ID de producto específico.
   * Se asume que solo hay un registro de stock por producto (inventario centralizado).
   * @param {string} productoId - El ID del producto.
   * @returns {object|null} El objeto de stock o null si no se encuentra.
   */
  static async obtenerPorProducto(productoId) {
    try {
      // Realiza una consulta filtrando por el campo 'productoId'
      const snapshot = await db.collection(COLECCION)
        .where('productoId', '==', productoId)
        .limit(1) // Solo necesitamos un resultado
        .get();

      if (snapshot.empty) {
        return null;
      }

      // Retorna los datos del primer documento encontrado
      return snapshot.docs[0].data();

    } catch (error) {
      throw new Error(`Error al buscar stock: ${error.message}`);
    }
  }

  /**
   * Método para actualizar campos de un registro de stock por su ID.
   * Actualiza automáticamente la marca de tiempo 'ultimaActualizacion'.
   * @param {string} id - El ID del stock a actualizar.
   * @param {object} datosActualizados - Los campos a modificar.
   * @returns {object|null} El objeto del stock actualizado o null.
   */
  static async actualizar(id, datosActualizados) {
    try {
      const stockRef = db.collection(COLECCION).doc(id);
      const doc = await stockRef.get();

      if (!doc.exists) {
        return null;
      }

      // Añade o actualiza la marca de tiempo de la última modificación
      datosActualizados.ultimaActualizacion = new Date().toISOString();

      // Realiza la actualización parcial del documento
      await stockRef.update(datosActualizados);
      
      // Retorna el objeto actualizado
      return await this.obtenerPorId(id);

    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  /**
   * Método para eliminar un registro de stock (eliminación física).
   * @param {string} id - El ID del stock a eliminar.
   * @returns {object|null} Un objeto de confirmación o null si no se encontró.
   */
  static async eliminar(id) {
    try {
      const stockRef = db.collection(COLECCION).doc(id);
      const doc = await stockRef.get();

      if (!doc.exists) {
        return null;
      }

      // Elimina el documento de Firestore
      await stockRef.delete();
      return { id, eliminado: true };

    } catch (error) {
      throw new Error(`Error al eliminar stock: ${error.message}`);
    }
  }

  /**
   * Método transaccional para descontar una cantidad del stock de un producto.
   * Incluye validación de stock insuficiente.
   * @param {string} productoId - El ID del producto.
   * @param {number} cantidad - La cantidad a descontar.
   * @returns {object} El resultado de la operación (cantidad restante).
   */
  static async descontarStock(productoId, cantidad) {
    try {
      // 1. Obtener los datos actuales del stock
      const stockData = await this.obtenerPorProducto(productoId);

      if (!stockData) {
        throw new Error('Stock no encontrado para el producto');
      }

      // 2. Validar que la cantidad a descontar no exceda el stock actual
      if (stockData.cantidad < cantidad) {
        throw new Error('Stock insuficiente');
      }

      // 3. Calcular la nueva cantidad
      const nuevaCantidad = stockData.cantidad - cantidad;

      // 4. Actualizar el documento de stock con la nueva cantidad
      await db.collection(COLECCION).doc(stockData.id).update({
        cantidad: nuevaCantidad,
        ultimaActualizacion: new Date().toISOString()
      });

      return { productoId, cantidadDescontada: cantidad, cantidadRestante: nuevaCantidad };

    } catch (error) {
      throw new Error(`Error al descontar stock: ${error.message}`);
    }
  }

  /**
   * Método transaccional para aumentar una cantidad al stock de un producto.
   * @param {string} productoId - El ID del producto.
   * @param {number} cantidad - La cantidad a aumentar.
   * @returns {object} El resultado de la operación (cantidad total).
   */
  static async aumentarStock(productoId, cantidad) {
    try {
      // 1. Obtener los datos actuales del stock
      const stockData = await this.obtenerPorProducto(productoId);

      if (!stockData) {
        throw new Error('Stock no encontrado para el producto');
      }

      // 2. Calcular la nueva cantidad
      const nuevaCantidad = stockData.cantidad + cantidad;

      // 3. Actualizar el documento de stock con la nueva cantidad
      await db.collection(COLECCION).doc(stockData.id).update({
        cantidad: nuevaCantidad,
        ultimaActualizacion: new Date().toISOString()
      });

      return { productoId, cantidadAumentada: cantidad, cantidadTotal: nuevaCantidad };

    } catch (error) {
      throw new Error(`Error al aumentar stock: ${error.message}`);
    }
  }

  /**
   * Método para obtener todos los productos cuyo stock actual es menor o igual al stock mínimo.
   * @returns {array} Un array de registros de stock bajo.
   */
  static async obtenerBajoStock() {
    try {
      // Nota: Firestore no permite consultas directas donde un campo depende de otro (cantidad <= stockMinimo)
      // Por lo tanto, se opta por obtener todos y filtrar en memoria (válido para colecciones pequeñas a medianas)
      const snapshot = await db.collection(COLECCION).get();

      const stocksBajos = [];
      snapshot.forEach(doc => {
        const stock = doc.data();
        // Lógica de filtrado en el lado de la aplicación:
        if (stock.cantidad <= stock.stockMinimo) {
          stocksBajos.push(stock);
        }
      });

      return stocksBajos;

    } catch (error) {
      throw new Error(`Error al obtener stocks bajos: ${error.message}`);
    }
  }
}

// Exporta el modelo para ser utilizado por la capa de servicios
module.exports = StockModel;