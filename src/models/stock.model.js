const { db } = require('../../config/firebase');

const COLECCION = 'stock';

class StockModel {
  
  static async crear(datosStock) {
    try {
      const stockRef = db.collection(COLECCION).doc();
      
      const nuevoStock = {
        id: stockRef.id,
        productoId: datosStock.productoId,
        cantidad: datosStock.cantidad || 0,
        ubicacion: datosStock.ubicacion || '',
        stockMinimo: datosStock.stockMinimo || 5,
        ultimaActualizacion: new Date().toISOString()
      };
      
      await stockRef.set(nuevoStock);
      return nuevoStock;
      
    } catch (error) {
      throw new Error(`Error al crear stock: ${error.message}`);
    }
  }

  static async obtenerTodos() {
    try {
      const snapshot = await db.collection(COLECCION).get();
      
      const stocks = [];
      snapshot.forEach(doc => stocks.push(doc.data()));
      
      return stocks;
      
    } catch (error) {
      throw new Error(`Error al obtener stocks: ${error.message}`);
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
      throw new Error(`Error al obtener stock: ${error.message}`);
    }
  }

  static async obtenerPorProducto(productoId) {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('productoId', '==', productoId)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      return snapshot.docs[0].data();
      
    } catch (error) {
      throw new Error(`Error al buscar stock: ${error.message}`);
    }
  }

  static async actualizar(id, datosActualizados) {
    try {
      const stockRef = db.collection(COLECCION).doc(id);
      const doc = await stockRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      datosActualizados.ultimaActualizacion = new Date().toISOString();
      
      await stockRef.update(datosActualizados);
      return await this.obtenerPorId(id);
      
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      const stockRef = db.collection(COLECCION).doc(id);
      const doc = await stockRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await stockRef.delete();
      return { id, eliminado: true };
      
    } catch (error) {
      throw new Error(`Error al eliminar stock: ${error.message}`);
    }
  }

  static async descontarStock(productoId, cantidad) {
    try {
      const stockData = await this.obtenerPorProducto(productoId);
      
      if (!stockData) {
        throw new Error('Stock no encontrado para el producto');
      }
      
      if (stockData.cantidad < cantidad) {
        throw new Error('Stock insuficiente');
      }
      
      const nuevaCantidad = stockData.cantidad - cantidad;
      
      await db.collection(COLECCION).doc(stockData.id).update({
        cantidad: nuevaCantidad,
        ultimaActualizacion: new Date().toISOString()
      });
      
      return { productoId, cantidadDescontada: cantidad, cantidadRestante: nuevaCantidad };
      
    } catch (error) {
      throw new Error(`Error al descontar stock: ${error.message}`);
    }
  }

  static async aumentarStock(productoId, cantidad) {
    try {
      const stockData = await this.obtenerPorProducto(productoId);
      
      if (!stockData) {
        throw new Error('Stock no encontrado para el producto');
      }
      
      const nuevaCantidad = stockData.cantidad + cantidad;
      
      await db.collection(COLECCION).doc(stockData.id).update({
        cantidad: nuevaCantidad,
        ultimaActualizacion: new Date().toISOString()
      });
      
      return { productoId, cantidadAumentada: cantidad, cantidadTotal: nuevaCantidad };
      
    } catch (error) {
      throw new Error(`Error al aumentar stock: ${error.message}`);
    }
  }

  static async obtenerBajoStock() {
    try {
      const snapshot = await db.collection(COLECCION).get();
      
      const stocksBajos = [];
      snapshot.forEach(doc => {
        const stock = doc.data();
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

module.exports = StockModel;