const ProductoService = require('../services/producto.service');

class ProductoController {
  
  // POST /api/productos
  static async crear(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/productos');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const producto = await ProductoService.crear(req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Producto creado');
      console.log('==========================================\n');
      
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: producto
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/productos
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/productos');
      
      const productos = await ProductoService.obtenerTodos();
      
      console.log('✅ RESPUESTA EXITOSA:', productos.length, 'productos encontrados');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        count: productos.length,
        data: productos
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/productos/:id
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/productos/${req.params.id}`);
      
      const producto = await ProductoService.obtenerPorId(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Producto encontrado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        data: producto
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // GET /api/productos/categoria/:categoriaId
  static async obtenerPorCategoria(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/productos/categoria/${req.params.categoriaId}`);
      
      const productos = await ProductoService.obtenerPorCategoria(req.params.categoriaId);
      
      console.log('✅ RESPUESTA EXITOSA:', productos.length, 'productos encontrados');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        count: productos.length,
        data: productos
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // PUT /api/productos/:id
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/productos/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const producto = await ProductoService.actualizar(req.params.id, req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Producto actualizado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // DELETE /api/productos/:id
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/productos/${req.params.id}`);
      
      const resultado = await ProductoService.eliminar(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Producto eliminado');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
        data: resultado
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }
}

module.exports = ProductoController;