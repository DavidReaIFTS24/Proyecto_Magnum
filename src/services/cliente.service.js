// Importa el modelo de Cliente, que es la capa de acceso a datos (interactúa con la DB)
const ClienteModel = require('../models/cliente.model');

// Define la clase de servicio que contendrá la lógica de negocio para la entidad Cliente
class ClienteService {

  /**
   * Método estático para crear un nuevo cliente.
   * Incluye la validación de campos requeridos y la unicidad del DNI.
   * @param {object} datosCliente - Objeto con la información del nuevo cliente.
   * @returns {object} El objeto del cliente recién creado.
   */
  static async crear(datosCliente) {
    console.log('📝 Servicio: Creando nuevo cliente...');

    // 1. Validar que los campos esenciales estén presentes en los datos
    if (!datosCliente.nombre || !datosCliente.email || !datosCliente.dni) {
      throw new Error('Nombre, email y DNI son requeridos');
    }

    // 2. Lógica de negocio: Verificar que el DNI no exista ya en la base de datos
    const clienteExistente = await ClienteModel.obtenerPorDni(datosCliente.dni);
    if (clienteExistente) {
      // Si se encuentra un cliente con ese DNI, lanza un error de duplicidad
      throw new Error('Ya existe un cliente con ese DNI');
    }

    // 3. Llama al método del modelo para crear el cliente en la base de datos
    const cliente = await ClienteModel.crear(datosCliente);
    console.log(`✅ Cliente creado: ${cliente.nombre}`);

    // Devuelve el objeto del cliente creado
    return cliente;
  }

  /**
   * Método estático para obtener todos los clientes.
   * @returns {array} Un array con todos los objetos de cliente.
   */
  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los clientes...');
    // Llama al método del modelo para recuperar la lista completa de clientes
    const clientes = await ClienteModel.obtenerTodos();
    console.log(`✅ ${clientes.length} clientes encontrados`);
    return clientes;
  }

  /**
   * Método estático para obtener un cliente por su ID.
   * @param {number|string} id - El ID único del cliente.
   * @returns {object} El objeto del cliente encontrado.
   */
  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando cliente ${id}...`);
    // Llama al método del modelo para buscar por ID
    const cliente = await ClienteModel.obtenerPorId(id);

    // Si el cliente no es encontrado, lanza un error
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    console.log(`✅ Cliente encontrado: ${cliente.nombre}`);
    return cliente;
  }

  /**
   * Método estático para actualizar la información de un cliente.
   * @param {number|string} id - El ID del cliente a actualizar.
   * @param {object} datosActualizados - Objeto con los campos y nuevos valores a actualizar.
   * @returns {object} El objeto del cliente actualizado.
   */
  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando cliente ${id}...`);
    
    // Llama al método del modelo para ejecutar la actualización
    const cliente = await ClienteModel.actualizar(id, datosActualizados);

    // Si el resultado es nulo/falso, significa que el cliente no existía
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    console.log(`✅ Cliente actualizado: ${cliente.nombre}`);
    return cliente;
  }

  /**
   * Método estático para eliminar un cliente.
   * @param {number|string} id - El ID del cliente a eliminar.
   * @returns {boolean} True si la eliminación fue exitosa.
   */
  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando cliente ${id}...`);

    // Llama al método del modelo para eliminar el cliente
    // Se asume que retorna true o el número de filas afectadas si se eliminó, o false/0 si no se encontró
    const resultado = await ClienteModel.eliminar(id);

    // Verifica si la eliminación fue exitosa
    if (!resultado) {
      throw new Error('Cliente no encontrado');
    }

    console.log(`✅ Cliente eliminado: ${id}`);
    return resultado;
  }
}

// Exporta la clase de servicio para que pueda ser utilizada por los controladores
module.exports = ClienteService;