// Importa la capa de servicio, donde reside la lógica de negocio (validaciones e interacción con el modelo)
const ProductoService = require('../services/producto.service');

// Define la clase de controlador que mapea las peticiones HTTP a la lógica de negocio
class ProductoController {

  // --- 1. Crear Nuevo Producto (POST /api/productos) ---
  
  /**
   * Maneja la petición para crear un nuevo producto.
   */
  static async crear(req, res, next) {
    try {
      // Registro de la petición entrante
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/productos');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la tarea de creación a la capa de servicio
      const producto = await ProductoService.crear(req.body);

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA: Producto creado');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente con código 201 Created
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: producto
      });

    } catch (error) {
      // Captura y pasa el error al middleware global de manejo de errores
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 2. Obtener Todos los Productos (GET /api/productos) ---
  
  /**
   * Maneja la petición para obtener una lista de todos los productos activos.
   */
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/productos');

      // Delega la tarea de obtener datos a la capa de servicio
      const productos = await ProductoService.obtenerTodos();

      console.log('✅ RESPUESTA EXITOSA:', productos.length, 'productos encontrados');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente
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

  // --- 3. Obtener Producto por ID (GET /api/productos/:id) ---
  
  /**
   * Maneja la petición para obtener un producto por su ID.
   */
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      // Obtiene el ID de los parámetros de la ruta
      console.log(`🚀 POSTMAN REQUEST: GET /api/productos/${req.params.id}`);

      // Delega la búsqueda al servicio
      const producto = await ProductoService.obtenerPorId(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Producto encontrado');
      console.log('==========================================\n');

      // Envía el producto encontrado
      res.json({
        success: true,
        data: producto
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Producto no encontrado' (responde con 404)
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 4. Obtener Productos por Categoría (GET /api/productos/categoria/:categoriaId) ---

  /**
   * Maneja la petición para obtener productos filtrados por ID de categoría.
   */
  static async obtenerPorCategoria(req, res, next) {
    try {
      console.log('==========================================');
      // Obtiene el ID de la categoría de los parámetros de la ruta
      console.log(`🚀 POSTMAN REQUEST: GET /api/productos/categoria/${req.params.categoriaId}`);

      // Delega la búsqueda filtrada al servicio
      const productos = await ProductoService.obtenerPorCategoria(req.params.categoriaId);

      console.log('✅ RESPUESTA EXITOSA:', productos.length, 'productos encontrados');
      console.log('==========================================\n');

      // Envía los productos encontrados
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

  // --- 5. Actualizar Producto (PUT /api/productos/:id) ---
  
  /**
   * Maneja la petición para actualizar los datos de un producto.
   */
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/productos/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la actualización al servicio, pasando el ID y los datos del cuerpo
      const producto = await ProductoService.actualizar(req.params.id, req.body);

      console.log('✅ RESPUESTA EXITOSA: Producto actualizado');
      console.log('==========================================\n');

      // Envía el resultado actualizado
      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Producto no encontrado'
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 6. Eliminar Producto (Soft Delete) (DELETE /api/productos/:id) ---

  /**
   * Maneja la petición para "eliminar" (soft delete) un producto marcándolo como inactivo.
   */
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/productos/${req.params.id}`);

      // Delega la eliminación al servicio
      const resultado = await ProductoService.eliminar(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Producto eliminado');
      console.log('==========================================\n');

      // Envía la confirmación
      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Producto no encontrado'
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

// Exporta el controlador para ser utilizado por el router
module.exports = ProductoController;