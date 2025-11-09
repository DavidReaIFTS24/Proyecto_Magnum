const CategoriaService = require('../services/categoria.service');

class CategoriaController {
  
  // POST /api/categorias
  static async crear(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/categorias');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const categoria = await CategoriaService.crear(req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Categoría creada');
      console.log('==========================================\n');
      
      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: categoria
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/categorias
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/categorias');
      
      const categorias = await CategoriaService.obtenerTodos();
      
      console.log('✅ RESPUESTA EXITOSA:', categorias.length, 'categorías encontradas');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        count: categorias.length,
        data: categorias
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // GET /api/categorias/:id
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/categorias/${req.params.id}`);
      
      const categoria = await CategoriaService.obtenerPorId(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Categoría encontrada');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        data: categoria
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // PUT /api/categorias/:id
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/categorias/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      
      const categoria = await CategoriaService.actualizar(req.params.id, req.body);
      
      console.log('✅ RESPUESTA EXITOSA: Categoría actualizada');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: categoria
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }

  // DELETE /api/categorias/:id
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/categorias/${req.params.id}`);
      
      const resultado = await CategoriaService.eliminar(req.params.id);
      
      console.log('✅ RESPUESTA EXITOSA: Categoría eliminada');
      console.log('==========================================\n');
      
      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente',
        data: resultado
      });
      
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      next(error);
    }
  }
}

module.exports = CategoriaController;