const StockModel = require('../models/stock.model');
const ProductoModel = require('../models/producto.model');

class StockService {
  
  static async crear(datosStock) {
    console.log('📝 Servicio: Creando registro de stock...');
    
    if (!datosStock.productoId) {
      throw new Error('El ID del producto es requerido');
    }
    
    // Verificar que el producto existe
    const producto = await ProductoModel.obtenerPorId(datosStock.productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    const stock = await StockModel.crear(datosStock);
    console.log(`✅ Stock creado para producto: ${datosStock.productoId}`);
    
    return stock;
  }

  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los stocks...');
    const stocks = await StockModel.obtenerTodos();
    console.log(`✅ ${stocks.length} registros de stock encontrados`);
    return stocks;
  }

  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando stock ${id}...`);
    const stock = await StockModel.obtenerPorId(id);
    
    if (!stock) {
      throw new Error('Stock no encontrado');
    }
    
    console.log(`✅ Stock encontrado`);
    return stock;
  }

  static async obtenerPorProducto(productoId) {
    console.log(`🔍 Servicio: Buscando stock del producto ${productoId}...`);
    const stock = await StockModel.obtenerPorProducto(productoId);
    
    if (!stock) {
      throw new Error('Stock no encontrado para este producto');
    }
    
    console.log(`✅ Stock encontrado: ${stock.cantidad} unidades`);
    return stock;
  }

  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando stock ${id}...`);
    
    const stock = await StockModel.actualizar(id, datosActualizados);
    
    if (!stock) {
      throw new Error('Stock no encontrado');
    }
    
    console.log(`✅ Stock actualizado`);
    return stock;
  }

  static async aumentarStock(productoId, cantidad) {
    console.log(`➕ Servicio: Aumentando stock del producto ${productoId} en ${cantidad}...`);
    
    const resultado = await StockModel.aumentarStock(productoId, cantidad);
    console.log(`✅ Stock aumentado. Nueva cantidad: ${resultado.cantidadTotal}`);
    
    return resultado;
  }

  static async descontarStock(productoId, cantidad) {
    console.log(`➖ Servicio: Descontando ${cantidad} del stock del producto ${productoId}...`);
    
    const resultado = await StockModel.descontarStock(productoId, cantidad);
    console.log(`✅ Stock descontado. Cantidad restante: ${resultado.cantidadRestante}`);
    
    return resultado;
  }

  static async obtenerBajoStock() {
    console.log('⚠️ Servicio: Obteniendo productos con stock bajo...');
    const stocks = await StockModel.obtenerBajoStock();
    console.log(`✅ ${stocks.length} productos con stock bajo`);
    return stocks;
  }

  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando stock ${id}...`);
    
    const resultado = await StockModel.eliminar(id);
    
    if (!resultado) {
      throw new Error('Stock no encontrado');
    }
    
    console.log(`✅ Stock eliminado: ${id}`);
    return resultado;
  }
}

module.exports = StockService;