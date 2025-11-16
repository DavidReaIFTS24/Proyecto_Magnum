// Importa la instancia de la base de datos de Firebase (Firestore)
const { db } = require('../../config/firebase');

// Define el nombre de la colección en Firestore donde se almacenarán las categorías
const COLECCION = 'categorias';

// Define la clase que contiene los métodos para interactuar con la colección de categorías
class CategoriaModel {

  /**
   * Método para crear un nuevo registro de categoría en Firestore.
   * Inicializa el estado 'activa' como true.
   * @param {object} datosCategoria - Datos de la categoría a crear (nombre, descripción).
   * @returns {object} El objeto de la categoría creada.
   */
  static async crear(datosCategoria) {
    try {
      // 1. Obtiene una referencia a un nuevo documento, generando automáticamente un ID único
      const categoriaRef = db.collection(COLECCION).doc();

      // 2. Define la estructura del nuevo documento/categoría, con valores por defecto
      const nuevaCategoria = {
        id: categoriaRef.id, // Usa el ID generado por Firestore
        nombre: datosCategoria.nombre,
        descripcion: datosCategoria.descripcion || '', // Descripción opcional con valor por defecto
        activa: true, // Estado por defecto: activa (para soft delete)
        fechaCreacion: new Date().toISOString() // Marca de tiempo de creación
      };

      // 3. Escribe el nuevo documento en Firestore
      await categoriaRef.set(nuevaCategoria);
      return nuevaCategoria;

    } catch (error) {
      // Captura y relanza cualquier error
      throw new Error(`Error al crear categoría: ${error.message}`);
    }
  }

  /**
   * Método para obtener todas las categorías que están activas.
   * @returns {array} Un array de objetos de categoría.
   */
  static async obtenerTodos() {
    try {
      // Realiza una consulta (query) para obtener solo los documentos donde 'activa' es true
      const snapshot = await db.collection(COLECCION)
        .where('activa', '==', true)
        .get();

      const categorias = [];
      // Itera y añade los datos de cada documento al array
      snapshot.forEach(doc => categorias.push(doc.data()));

      return categorias;

    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  /**
   * Método para obtener una categoría por su ID de documento en Firestore.
   * @param {string} id - El ID único del documento.
   * @returns {object|null} El objeto de la categoría o null si no existe.
   */
  static async obtenerPorId(id) {
    try {
      // Obtiene un documento específico por su ID
      const doc = await db.collection(COLECCION).doc(id).get();

      if (!doc.exists) {
        return null; // Retorna null si el documento no existe
      }

      return doc.data(); // Retorna los datos del documento

    } catch (error) {
      throw new Error(`Error al obtener categoría: ${error.message}`);
    }
  }

  /**
   * Método para actualizar los datos de una categoría.
   * @param {string} id - El ID de la categoría a actualizar.
   * @param {object} datosActualizados - Los campos a modificar.
   * @returns {object|null} El objeto de la categoría actualizada o null.
   */
  static async actualizar(id, datosActualizados) {
    try {
      const categoriaRef = db.collection(COLECCION).doc(id);
      const doc = await categoriaRef.get();

      if (!doc.exists) {
        return null; // La categoría no existe
      }

      // Realiza la actualización parcial del documento
      await categoriaRef.update(datosActualizados);

      // Obtiene la categoría actualizada para retornarla
      return await this.obtenerPorId(id);

    } catch (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }
  }

  /**
   * Método para "eliminar" una categoría realizando un soft delete.
   * Marca el campo 'activa' como false en lugar de borrar el documento.
   * @param {string} id - El ID de la categoría a eliminar.
   * @returns {object|null} Un objeto de confirmación o null si no se encontró.
   */
  static async eliminar(id) {
    try {
      const categoriaRef = db.collection(COLECCION).doc(id);
      const doc = await categoriaRef.get();

      if (!doc.exists) {
        return null; // La categoría no existe
      }

      // Realiza un soft delete: actualiza el campo 'activa' a false
      await categoriaRef.update({ activa: false });
      return { id, eliminado: true };

    } catch (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  }
}

// Exporta el modelo para ser utilizado por la capa de servicios
module.exports = CategoriaModel;