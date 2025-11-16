// Importa la capa de servicio, donde reside la lógica de negocio (validaciones e interacción con el modelo)
const CategoriaService = require('../services/categoria.service');

// Define la clase de controlador que mapea las peticiones HTTP a la lógica de negocio
class CategoriaController {

  // --- 1. Crear Nueva Categoría (POST /api/categorias) ---
  
  /**
   * Maneja la petición para crear una nueva categoría.
   */
  static async crear(req, res, next) {
    try {
      // Registro de la petición entrante
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/categorias');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la tarea de creación a la capa de servicio
      const categoria = await CategoriaService.crear(req.body);

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA: Categoría creada');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente con código 201 Created
      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: categoria
      });

    } catch (error) {
      // Captura y pasa el error al middleware global de manejo de errores
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 2. Obtener Todas las Categorías (GET /api/categorias) ---
  
  /**
   * Maneja la petición para obtener una lista de todas las categorías activas.
   */
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/categorias');

      // Delega la tarea de obtener datos a la capa de servicio
      const categorias = await CategoriaService.obtenerTodos();

      console.log('✅ RESPUESTA EXITOSA:', categorias.length, 'categorías encontradas');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente
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

  // --- 3. Obtener Categoría por ID (GET /api/categorias/:id) ---
  
  /**
   * Maneja la petición para obtener una categoría por su ID.
   */
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      // Obtiene el ID de los parámetros de la ruta
      console.log(`🚀 POSTMAN REQUEST: GET /api/categorias/${req.params.id}`);

      // Delega la búsqueda al servicio
      const categoria = await CategoriaService.obtenerPorId(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Categoría encontrada');
      console.log('==========================================\n');

      // Envía la categoría encontrada
      res.json({
        success: true,
        data: categoria
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Categoría no encontrada' (responde con 404)
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 4. Actualizar Categoría (PUT /api/categorias/:id) ---
  
  /**
   * Maneja la petición para actualizar los datos de una categoría.
   */
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/categorias/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la actualización al servicio, pasando el ID y los datos del cuerpo
      const categoria = await CategoriaService.actualizar(req.params.id, req.body);

      console.log('✅ RESPUESTA EXITOSA: Categoría actualizada');
      console.log('==========================================\n');

      // Envía el resultado actualizado
      res.json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: categoria
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Categoría no encontrada'
      if (error.message === 'Categoría no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 5. Eliminar Categoría (Soft Delete) (DELETE /api/categorias/:id) ---

  /**
   * Maneja la petición para "eliminar" (soft delete) una categoría marcándola como inactiva.
   */
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/categorias/${req.params.id}`);

      // Delega la eliminación al servicio
      const resultado = await CategoriaService.eliminar(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Categoría eliminada');
      console.log('==========================================\n');

      // Envía la confirmación
      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Categoría no encontrada'
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

// Exporta el controlador para ser utilizado por el router
module.exports = CategoriaController;