const { db } = require('../../config/firebase');

const COLECCION = 'productos';

class ProductoModel {
  
  static async crear(datosProducto) {
    try {
      const productoRef = db.collection(COLECCION).doc();
      
      const nuevoProducto = {
        id: productoRef.id,
        nombre: datosProducto.nombre,
        descripcion: datosProducto.descripcion || '',
        categoriaId: datosProducto.categoriaId,
        precio: datosProducto.precio,
        color: datosProducto.color || '',
        material: datosProducto.material || '',
        dimensiones: datosProducto.dimensiones || '',
        imagen: datosProducto.imagen || '',
        activo: true,
        fechaCreacion: new Date().toISOString()
      };
      
      await productoRef.set(nuevoProducto);
      return nuevoProducto;
      
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  static async obtenerTodos() {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('activo', '==', true)
        .get();
      
      const productos = [];
      snapshot.forEach(doc => productos.push(doc.data()));
      
      return productos;
      
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
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
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  static async obtenerPorCategoria(categoriaId) {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('categoriaId', '==', categoriaId)
        .where('activo', '==', true)
        .get();
      
      const productos = [];
      snapshot.forEach(doc => productos.push(doc.data()));
      
      return productos;
      
    } catch (error) {
      throw new Error(`Error al obtener productos por categoría: ${error.message}`);
    }
  }

  static async actualizar(id, datosActualizados) {
    try {
      const productoRef = db.collection(COLECCION).doc(id);
      const doc = await productoRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await productoRef.update(datosActualizados);
      return await this.obtenerPorId(id);
      
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      const productoRef = db.collection(COLECCION).doc(id);
      const doc = await productoRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await productoRef.update({ activo: false });
      return { id, eliminado: true };
      
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

module.exports = ProductoModel;