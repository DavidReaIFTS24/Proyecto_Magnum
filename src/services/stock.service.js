// Importa el modelo de Stock, que maneja las operaciones directas con la base de datos para la tabla de inventario
const StockModel = require('../models/stock.model');
// Importa el modelo de Producto, necesario para validar la existencia de un producto antes de manipular su stock
const ProductoModel = require('../models/producto.model');

// Define la clase de servicio que encapsula la lógica de negocio del stock
class StockService {

  /**
   * Método estático para crear un nuevo registro de stock.
   * Realiza una validación de existencia del producto asociado antes de la creación.
   * @param {object} datosStock - Objeto con los datos del stock a crear (ej: productoId, cantidad, ubicacion).
   * @returns {object} El objeto del stock recién creado.
   */
  static async crear(datosStock) {
    console.log('📝 Servicio: Creando registro de stock...');

    // 1. Validar la presencia del campo clave 'productoId'
    if (!datosStock.productoId) {
      throw new Error('El ID del producto es requerido');
    }

    // 2. Verificar que el producto asociado (la clave foránea) realmente exista
    const producto = await ProductoModel.obtenerPorId(datosStock.productoId);
    if (!producto) {
      // Si el producto no se encuentra, aborta la operación y lanza un error
      throw new Error('Producto no encontrado');
    }

    // 3. Llama al método del modelo para crear el registro de stock en la base de datos
    const stock = await StockModel.crear(datosStock);
    console.log(`✅ Stock creado para producto: ${datosStock.productoId}`);

    return stock;
  }

  /**
   * Método estático para obtener todos los registros de stock.
   * @returns {array} Un array con todos los objetos de stock.
   */
  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los stocks...');
    // Llama al método del modelo para recuperar todos los registros
    const stocks = await StockModel.obtenerTodos();
    console.log(`✅ ${stocks.length} registros de stock encontrados`);
    return stocks;
  }

  /**
   * Método estático para obtener un registro de stock por su ID.
   * @param {number|string} id - El ID único del registro de stock.
   * @returns {object} El objeto de stock encontrado.
   */
  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando stock ${id}...`);
    // Llama al método del modelo para buscar por ID
    const stock = await StockModel.obtenerPorId(id);

    // Si no se encuentra el registro, lanza un error
    if (!stock) {
      throw new Error('Stock no encontrado');
    }

    console.log(`✅ Stock encontrado`);
    return stock;
  }

  /**
   * Método estático para obtener el stock asociado a un producto específico.
   * Se asume que solo hay un registro de stock por producto (inventario centralizado).
   * @param {number|string} productoId - El ID del producto.
   * @returns {object} El objeto de stock del producto.
   */
  static async obtenerPorProducto(productoId) {
    console.log(`🔍 Servicio: Buscando stock del producto ${productoId}...`);
    // Llama al método del modelo para buscar por ID de producto
    const stock = await StockModel.obtenerPorProducto(productoId);

    // Si no hay registro de stock para ese producto, lanza un error
    if (!stock) {
      throw new Error('Stock no encontrado para este producto');
    }

    console.log(`✅ Stock encontrado: ${stock.cantidad} unidades`);
    return stock;
  }

  /**
   * Método estático para actualizar cualquier campo de un registro de stock por su ID.
   * @param {number|string} id - El ID del registro de stock a actualizar.
   * @param {object} datosActualizados - Objeto con los campos y nuevos valores a actualizar.
   * @returns {object} El objeto de stock actualizado.
   */
  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando stock ${id}...`);

    // Llama al método del modelo para ejecutar la actualización
    const stock = await StockModel.actualizar(id, datosActualizados);

    // Si el resultado es nulo/falso, significa que el registro no existía
    if (!stock) {
      throw new Error('Stock no encontrado');
    }

    console.log(`✅ Stock actualizado`);
    return stock;
  }

  /**
   * Método estático para aumentar la cantidad de stock de un producto.
   * Útil para entradas de inventario o devoluciones.
   * @param {number|string} productoId - El ID del producto.
   * @param {number} cantidad - La cantidad a añadir.
   * @returns {object} El resultado de la operación (ej: la nueva cantidad total).
   */
  static async aumentarStock(productoId, cantidad) {
    console.log(`➕ Servicio: Aumentando stock del producto ${productoId} en ${cantidad}...`);

    // Llama al método del modelo, que debe manejar la lógica transaccional de suma en la DB
    const resultado = await StockModel.aumentarStock(productoId, cantidad);
    console.log(`✅ Stock aumentado. Nueva cantidad: ${resultado.cantidadTotal}`);

    return resultado;
  }

  /**
   * Método estático para descontar la cantidad de stock de un producto.
   * Útil para ventas o salidas de inventario.
   * @param {number|string} productoId - El ID del producto.
   * @param {number} cantidad - La cantidad a descontar.
   * @returns {object} El resultado de la operación (ej: la cantidad restante).
   */
  static async descontarStock(productoId, cantidad) {
    console.log(`➖ Servicio: Descontando ${cantidad} del stock del producto ${productoId}...`);

    // Llama al método del modelo, que debe incluir validaciones (ej: no permitir stock negativo)
    const resultado = await StockModel.descontarStock(productoId, cantidad);
    console.log(`✅ Stock descontado. Cantidad restante: ${resultado.cantidadRestante}`);

    return resultado;
  }

  /**
   * Método estático para obtener productos cuyo stock ha caído por debajo de un umbral predefinido.
   * @returns {array} Un array de registros de stock bajo.
   */
  static async obtenerBajoStock() {
    console.log('⚠️ Servicio: Obteniendo productos con stock bajo...');
    // Llama al método del modelo, que contiene la lógica de filtrado del umbral
    const stocks = await StockModel.obtenerBajoStock();
    console.log(`✅ ${stocks.length} productos con stock bajo`);
    return stocks;
  }

  /**
   * Método estático para eliminar un registro de stock por su ID.
   * @param {number|string} id - El ID del registro de stock a eliminar.
   * @returns {boolean} True si la eliminación fue exitosa.
   */
  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando stock ${id}...`);

    // Llama al método del modelo para ejecutar la eliminación
    const resultado = await StockModel.eliminar(id);

    // Si el resultado es nulo/falso, significa que el registro no existía
    if (!resultado) {
      throw new Error('Stock no encontrado');
    }

    console.log(`✅ Stock eliminado: ${id}`);
    return resultado;
  }
}

// Exporta la clase para que pueda ser utilizada por la capa de controladores (ej: en las rutas de la API)
module.exports = StockService;