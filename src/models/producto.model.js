// Importa la instancia de la base de datos de Firebase (Firestore)
const { db } = require('../../config/firebase');

// Define el nombre de la colección en Firestore donde se almacenarán los productos
const COLECCION = 'productos';

// Define la clase que contiene los métodos para interactuar con la colección de productos
class ProductoModel {

  /**
   * Método para crear un nuevo registro de producto en Firestore.
   * Inicializa campos opcionales con cadenas vacías y establece el estado 'activo' como true.
   * @param {object} datosProducto - Datos del producto a crear.
   * @returns {object} El objeto del producto creado.
   */
  static async crear(datosProducto) {
    try {
      // 1. Obtiene una referencia a un nuevo documento, generando automáticamente un ID único
      const productoRef = db.collection(COLECCION).doc();

      // 2. Define la estructura del nuevo documento/producto, incluyendo valores por defecto
      const nuevoProducto = {
        id: productoRef.id, // Usa el ID generado por Firestore
        nombre: datosProducto.nombre,
        descripcion: datosProducto.descripcion || '', // Valor por defecto
        categoriaId: datosProducto.categoriaId, // Clave foránea a la colección de categorías
        precio: datosProducto.precio,
        color: datosProducto.color || '',
        material: datosProducto.material || '',
        dimensiones: datosProducto.dimensiones || '',
        imagen: datosProducto.imagen || '',
        activo: true, // Estado por defecto: activo
        fechaCreacion: new Date().toISOString() // Marca de tiempo de creación
      };

      // 3. Escribe el nuevo documento en Firestore
      await productoRef.set(nuevoProducto);
      return nuevoProducto;

    } catch (error) {
      // Captura y relanza cualquier error
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  /**
   * Método para obtener todos los productos activos (soft delete).
   * @returns {array} Un array de objetos de producto.
   */
  static async obtenerTodos() {
    try {
      // Realiza una consulta (query) para obtener solo los documentos donde 'activo' es true
      const snapshot = await db.collection(COLECCION)
        .where('activo', '==', true)
        .get();

      const productos = [];
      // Itera y añade los datos de cada documento al array
      snapshot.forEach(doc => productos.push(doc.data()));

      return productos;

    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  /**
   * Método para obtener un producto por su ID de documento en Firestore.
   * @param {string} id - El ID único del documento.
   * @returns {object|null} El objeto del producto o null si no existe.
   */
  static async obtenerPorId(id) {
    try {
      // Obtiene un documento específico por su ID
      const doc = await db.collection(COLECCION).doc(id).get();

      // Si el documento no existe, retorna null
      if (!doc.exists) {
        return null;
      }

      // Retorna los datos del documento
      return doc.data();

    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  /**
   * Método para obtener productos filtrados por su ID de categoría.
   * Solo incluye productos que estén marcados como activos.
   * @param {string} categoriaId - El ID de la categoría a filtrar.
   * @returns {array} Un array de productos activos que pertenecen a esa categoría.
   */
  static async obtenerPorCategoria(categoriaId) {
    try {
      // Realiza una consulta con dos condiciones: por 'categoriaId' y por 'activo'
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

  /**
   * Método para actualizar los datos de un producto.
   * @param {string} id - El ID del producto a actualizar.
   * @param {object} datosActualizados - Los campos a modificar.
   * @returns {object|null} El objeto del producto actualizado o null.
   */
  static async actualizar(id, datosActualizados) {
    try {
      const productoRef = db.collection(COLECCION).doc(id);
      const doc = await productoRef.get();

      if (!doc.exists) {
        return null; // El producto no existe
      }

      // Realiza la actualización parcial del documento
      await productoRef.update(datosActualizados);

      // Obtiene el producto actualizado para retornarlo
      return await this.obtenerPorId(id);

    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  /**
   * Método para "eliminar" un producto realizando un soft delete.
   * Marca el campo 'activo' como false en lugar de borrar el documento.
   * @param {string} id - El ID del producto a eliminar.
   * @returns {object|null} Un objeto de confirmación o null si no se encontró.
   */
  static async eliminar(id) {
    try {
      const productoRef = db.collection(COLECCION).doc(id);
      const doc = await productoRef.get();

      if (!doc.exists) {
        return null; // El producto no existe
      }

      // Realiza un soft delete: actualiza el campo 'activo' a false
      await productoRef.update({ activo: false });
      return { id, eliminado: true };

    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

// Exporta el modelo para ser utilizado por la capa de servicios
module.exports = ProductoModel;