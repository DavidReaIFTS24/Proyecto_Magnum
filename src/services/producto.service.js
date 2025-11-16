// Importa el modelo de Producto, que maneja las operaciones directas con la base de datos para los productos
const ProductoModel = require('../models/producto.model');
// Importa el modelo de Categoría, necesario para validar la existencia de una categoría al crear/actualizar un producto
const CategoriaModel = require('../models/categoria.model');
// Importa el modelo de Stock, necesario para inicializar el stock de un nuevo producto
const StockModel = require('../models/stock.model');

// Define la clase de servicio que encapsula la lógica de negocio para los productos
class ProductoService {

  /**
   * Método estático para crear un nuevo producto.
   * Incluye validación de campos requeridos y de existencia de la categoría.
   * Además, crea un registro de stock inicial.
   * @param {object} datosProducto - Objeto con la información del nuevo producto.
   * @returns {object} El objeto del producto recién creado.
   */
  static async crear(datosProducto) {
    console.log('📝 Servicio: Creando nuevo producto...');

    // 1. Validar que los campos esenciales estén presentes
    if (!datosProducto.nombre || !datosProducto.precio || !datosProducto.categoriaId) {
      throw new Error('Nombre, precio y categoría son requeridos');
    }

    // 2. Verificar que la categoría a la que se asignará el producto existe
    const categoria = await CategoriaModel.obtenerPorId(datosProducto.categoriaId);
    if (!categoria) {
      // Si la categoría no existe, lanza un error para detener la creación
      throw new Error('Categoría no encontrada');
    }

    // 3. Crea el producto en la base de datos
    const producto = await ProductoModel.crear(datosProducto);

    // 4. **Lógica de Integración:** Crea un registro de stock inicial para este nuevo producto
    await StockModel.crear({
      productoId: producto.id, // Asocia el stock al ID del producto recién creado
      cantidad: 0, // Inicia el stock en cero
      stockMinimo: 5 // Define un umbral inicial de stock mínimo
    });

    console.log(`✅ Producto creado: ${producto.nombre}`);

    return producto;
  }

  /**
   * Método estático para obtener todos los productos.
   * @returns {array} Un array con todos los objetos de producto.
   */
  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los productos...');
    // Llama al método del modelo para recuperar todos los productos
    const productos = await ProductoModel.obtenerTodos();
    console.log(`✅ ${productos.length} productos encontrados`);
    return productos;
  }

  /**
   * Método estático para obtener un producto por su ID.
   * **Incluye información de Stock para enriquecer la respuesta.**
   * @param {number|string} id - El ID único del producto.
   * @returns {object} El objeto del producto encontrado, con el campo `stock` añadido.
   */
  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando producto ${id}...`);
    // 1. Busca el producto por ID
    const producto = await ProductoModel.obtenerPorId(id);

    // Si el producto no es encontrado, lanza un error
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // 2. Obtener el stock asociado a este producto
    const stock = await StockModel.obtenerPorProducto(id);

    console.log(`✅ Producto encontrado: ${producto.nombre}`);
    // 3. Combina el objeto producto con la cantidad de stock
    // Usa el operador spread ({...producto}) y añade la cantidad de stock (o 0 si no se encuentra el registro de stock)
    return { ...producto, stock: stock?.cantidad || 0 };
  }

  /**
   * Método estático para obtener productos filtrados por una categoría específica.
   * @param {number|string} categoriaId - El ID de la categoría a buscar.
   * @returns {array} Un array de productos pertenecientes a esa categoría.
   */
  static async obtenerPorCategoria(categoriaId) {
    console.log(`🔍 Servicio: Obteniendo productos de categoría ${categoriaId}...`);
    // Llama al método del modelo para filtrar por categoría
    const productos = await ProductoModel.obtenerPorCategoria(categoriaId);
    console.log(`✅ ${productos.length} productos encontrados`);
    return productos;
  }

  /**
   * Método estático para actualizar la información de un producto.
   * Incluye validación de existencia de la nueva categoría si se proporciona.
   * @param {number|string} id - El ID del producto a actualizar.
   * @param {object} datosActualizados - Objeto con los campos y nuevos valores a actualizar.
   * @returns {object} El objeto del producto actualizado.
   */
  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando producto ${id}...`);

    // 1. Si se intenta cambiar la categoríaId, se valida que la nueva categoría exista
    if (datosActualizados.categoriaId) {
      const categoria = await CategoriaModel.obtenerPorId(datosActualizados.categoriaId);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
    }

    // 2. Realiza la actualización en la base de datos
    const producto = await ProductoModel.actualizar(id, datosActualizados);

    // 3. Verifica si la actualización fue exitosa (si el producto existía)
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    console.log(`✅ Producto actualizado: ${producto.nombre}`);
    return producto;
  }

  /**
   * Método estático para eliminar un producto.
   * @param {number|string} id - El ID del producto a eliminar.
   * @returns {boolean} True si la eliminación fue exitosa.
   */
  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando producto ${id}...`);

    // 1. Llama al método del modelo para eliminar el producto
    // Nota: Se asume que la base de datos tiene configuradas las restricciones (ON DELETE CASCADE)
    // para eliminar automáticamente el registro de stock asociado o que el StockModel.eliminar()
    // se llama desde el controlador si se necesita una eliminación explícita.
    const resultado = await ProductoModel.eliminar(id);

    // 2. Verifica si la eliminación fue exitosa (si el producto fue encontrado y eliminado)
    if (!resultado) {
      throw new Error('Producto no encontrado');
    }

    console.log(`✅ Producto eliminado: ${id}`);
    return resultado;
  }
}

// Exporta la clase de servicio para que pueda ser utilizada por los controladores
module.exports = ProductoService;