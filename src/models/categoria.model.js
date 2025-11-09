const { db } = require('../../config/firebase');

const COLECCION = 'categorias';

class CategoriaModel {
  
  static async crear(datosCategoria) {
    try {
      const categoriaRef = db.collection(COLECCION).doc();
      
      const nuevaCategoria = {
        id: categoriaRef.id,
        nombre: datosCategoria.nombre,
        descripcion: datosCategoria.descripcion || '',
        activa: true,
        fechaCreacion: new Date().toISOString()
      };
      
      await categoriaRef.set(nuevaCategoria);
      return nuevaCategoria;
      
    } catch (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }
  }

  static async obtenerTodos() {
    try {
      const snapshot = await db.collection(COLECCION)
        .where('activa', '==', true)
        .get();
      
      const categorias = [];
      snapshot.forEach(doc => categorias.push(doc.data()));
      
      return categorias;
      
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
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
      throw new Error(`Error al obtener categoría: ${error.message}`);
    }
  }

  static async actualizar(id, datosActualizados) {
    try {
      const categoriaRef = db.collection(COLECCION).doc(id);
      const doc = await categoriaRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await categoriaRef.update(datosActualizados);
      return await this.obtenerPorId(id);
      
    } catch (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      const categoriaRef = db.collection(COLECCION).doc(id);
      const doc = await categoriaRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await categoriaRef.update({ activa: false });
      return { id, eliminado: true };
      
    } catch (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  }
}

module.exports = CategoriaModel;