// Importa el modelo de Categoría, que es la capa de acceso a datos (interactúa con la DB)
const CategoriaModel = require('../models/categoria.model');

// Define la clase de servicio que contendrá la lógica de negocio para la entidad Categoría
class CategoriaService {

  /**
   * Método estático para crear una nueva categoría.
   * Incluye la validación de que el nombre es requerido.
   * @param {object} datosCategoria - Objeto con la información de la nueva categoría (ej: nombre, descripcion).
   * @returns {object} El objeto de la categoría recién creada.
   */
  static async crear(datosCategoria) {
    console.log('📝 Servicio: Creando nueva categoría...');

    // 1. Validar que el campo esencial 'nombre' esté presente
    if (!datosCategoria.nombre) {
      throw new Error('El nombre es requerido');
    }

    // 2. Llama al método del modelo para crear la categoría en la base de datos
    const categoria = await CategoriaModel.crear(datosCategoria);
    console.log(`✅ Categoría creada: ${categoria.nombre}`);

    // Devuelve el objeto de la categoría creada
    return categoria;
  }

  /**
   * Método estático para obtener todas las categorías.
   * @returns {array} Un array con todos los objetos de categoría.
   */
  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todas las categorías...');
    // Llama al método del modelo para recuperar la lista completa de categorías
    const categorias = await CategoriaModel.obtenerTodos();
    console.log(`✅ ${categorias.length} categorías encontradas`);
    return categorias;
  }

  /**
   * Método estático para obtener una categoría por su ID.
   * @param {number|string} id - El ID único de la categoría.
   * @returns {object} El objeto de la categoría encontrado.
   */
  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando categoría ${id}...`);
    // Llama al método del modelo para buscar por ID
    const categoria = await CategoriaModel.obtenerPorId(id);

    // Si la categoría no es encontrada, lanza un error
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }

    console.log(`✅ Categoría encontrada: ${categoria.nombre}`);
    return categoria;
  }

  /**
   * Método estático para actualizar la información de una categoría.
   * @param {number|string} id - El ID de la categoría a actualizar.
   * @param {object} datosActualizados - Objeto con los campos y nuevos valores a actualizar.
   * @returns {object} El objeto de la categoría actualizada.
   */
  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando categoría ${id}...`);

    // Llama al método del modelo para ejecutar la actualización
    const categoria = await CategoriaModel.actualizar(id, datosActualizados);

    // Si el resultado es nulo/falso, significa que la categoría no existía
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }

    console.log(`✅ Categoría actualizada: ${categoria.nombre}`);
    return categoria;
  }

  /**
   * Método estático para eliminar una categoría.
   * @param {number|string} id - El ID de la categoría a eliminar.
   * @returns {boolean} True si la eliminación fue exitosa.
   */
  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando categoría ${id}...`);

    // Llama al método del modelo para eliminar la categoría
    // Se asume que retorna true o el número de filas afectadas si se eliminó, o false/0 si no se encontró
    const resultado = await CategoriaModel.eliminar(id);

    // Verifica si la eliminación fue exitosa
    if (!resultado) {
      throw new Error('Categoría no encontrada');
    }

    console.log(`✅ Categoría eliminada: ${id}`);
    return resultado;
  }
}

// Exporta la clase de servicio para que pueda ser utilizada por los controladores
module.exports = CategoriaService;