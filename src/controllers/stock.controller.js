const StockService = require('../services/stock.service');

class StockController {
  
  // POST /api/stock
  static async crear(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/stock');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const stock = await StockService.crear(req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Stock creado');
      console.log('==========================================\n');
      
      res.status(201).json({
        success: true,
        message: 'Stock creado exitosamente',
        data: stock
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/stock
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/stock');
      
      const stocks = await StockService.obtenerTodos();
      
      console.log('✅ RESPUESTA EXITOSA:', stocks.length, 'registros encontrados');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/stock/:id
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/stock/${req.params.id}`);
      
      const stock = await StockService.obtenerPorId(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Stock encontrado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        data: stock
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Stock no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // GET /api/stock/producto/:productoId
  static async obtenerPorProducto(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/stock/producto/${req.params.productoId}`);
      
      const stock = await StockService.obtenerPorProducto(req.params.productoId);
      
      console.log('✅ RESPUESTA EXITOSA: Stock encontrado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        data: stock
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message.includes('Stock no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // GET /api/stock/bajo-stock
  static async obtenerBajoStock(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/stock/bajo-stock');
      
      const stocks = await StockService.obtenerBajoStock();
      
      console.log('✅ RESPUESTA EXITOSA:', stocks.length, 'productos con stock bajo');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // PUT /api/stock/:id
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/stock/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const stock = await StockService.actualizar(req.params.id, req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Stock actualizado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: stock
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Stock no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // PUT /api/stock/aumentar/:productoId
  static async aumentarStock(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/stock/aumentar/${req.params.productoId}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const { cantidad } = req.body;
      
      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La cantidad debe ser mayor a 0'
        });
      }
      
      const resultado = await StockService.aumentarStock(req.params.productoId, cantidad);
      
      console.log('✅ RESPUESTA EXITOSA: Stock aumentado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Stock aumentado exitosamente',
        data: resultado
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // DELETE /api/stock/:id
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/stock/${req.params.id}`);
      
      const resultado = await StockService.eliminar(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Stock eliminado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Stock eliminado exitosamente',
        data: resultado
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Stock no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }
}

module.exports = StockController;