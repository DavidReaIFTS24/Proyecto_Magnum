// Importa la capa de servicio, donde reside la lógica de negocio (validaciones e interacción con el modelo)
const ClienteService = require('../services/cliente.service');

// Define la clase de controlador que mapea las peticiones HTTP a la lógica de negocio
class ClienteController {

  // --- 1. Crear Nuevo Cliente (POST /api/clientes) ---
  
  /**
   * Maneja la petición para crear un nuevo cliente.
   */
  static async crear(req, res, next) {
    try {
      // Registro de la petición entrante
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/clientes');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la tarea de creación a la capa de servicio
      const cliente = await ClienteService.crear(req.body);

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA: Cliente creado');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente con código 201 Created
      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: cliente
      });

    } catch (error) {
      // Captura y pasa el error al middleware global de manejo de errores
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 2. Obtener Todos los Clientes (GET /api/clientes) ---
  
  /**
   * Maneja la petición para obtener una lista de todos los clientes activos.
   */
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/clientes');

      // Delega la tarea de obtener datos a la capa de servicio
      const clientes = await ClienteService.obtenerTodos();

      console.log('✅ RESPUESTA EXITOSA:', clientes.length, 'clientes encontrados');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente
      res.json({
        success: true,
        count: clientes.length,
        data: clientes
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 3. Obtener Cliente por ID (GET /api/clientes/:id) ---
  
  /**
   * Maneja la petición para obtener un cliente por su ID.
   */
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      // Obtiene el ID de los parámetros de la ruta
      console.log(`🚀 POSTMAN REQUEST: GET /api/clientes/${req.params.id}`);

      // Delega la búsqueda al servicio
      const cliente = await ClienteService.obtenerPorId(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Cliente encontrado');
      console.log('==========================================\n');

      // Envía el cliente encontrado
      res.json({
        success: true,
        data: cliente
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Cliente no encontrado' (responde con 404)
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 4. Actualizar Cliente (PUT /api/clientes/:id) ---
  
  /**
   * Maneja la petición para actualizar los datos de un cliente.
   */
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/clientes/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la actualización al servicio, pasando el ID y los datos del cuerpo
      const cliente = await ClienteService.actualizar(req.params.id, req.body);

      console.log('✅ RESPUESTA EXITOSA: Cliente actualizado');
      console.log('==========================================\n');

      // Envía el resultado actualizado
      res.json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: cliente
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Cliente no encontrado'
      if (error.message === 'Cliente no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 5. Eliminar Cliente (Soft Delete) (DELETE /api/clientes/:id) ---

  /**
   * Maneja la petición para "eliminar" (soft delete) un cliente marcándolo como inactivo.
   */
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/clientes/${req.params.id}`);

      // Delega la eliminación al servicio
      const resultado = await ClienteService.eliminar(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Cliente eliminado');
      console.log('==========================================\n');

      // Envía la confirmación
      res.json({
        success: true,
        message: 'Cliente eliminado exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Cliente no encontrado'
      if (error.message === 'Cliente no encontrado') {
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
module.exports = ClienteController;