const ClienteModel = require('../models/cliente.model');

class ClienteService {
  
  static async crear(datosCliente) {
    console.log('📝 Servicio: Creando nuevo cliente...');
    
    if (!datosCliente.nombre || !datosCliente.email || !datosCliente.dni) {
      throw new Error('Nombre, email y DNI son requeridos');
    }
    
    // Verificar que el DNI no exista
    const clienteExistente = await ClienteModel.obtenerPorDni(datosCliente.dni);
    if (clienteExistente) {
      throw new Error('Ya existe un cliente con ese DNI');
    }
    
    const cliente = await ClienteModel.crear(datosCliente);
    console.log(`✅ Cliente creado: ${cliente.nombre}`);
    
    return cliente;
  }

  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los clientes...');
    const clientes = await ClienteModel.obtenerTodos();
    console.log(`✅ ${clientes.length} clientes encontrados`);
    return clientes;
  }

  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando cliente ${id}...`);
    const cliente = await ClienteModel.obtenerPorId(id);
    
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    console.log(`✅ Cliente encontrado: ${cliente.nombre}`);
    return cliente;
  }

  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando cliente ${id}...`);
    
    const cliente = await ClienteModel.actualizar(id, datosActualizados);
    
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    console.log(`✅ Cliente actualizado: ${cliente.nombre}`);
    return cliente;
  }

  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando cliente ${id}...`);
    
    const resultado = await ClienteModel.eliminar(id);
    
    if (!resultado) {
      throw new Error('Cliente no encontrado');
    }
    
    console.log(`✅ Cliente eliminado: ${id}`);
    return resultado;
  }
}

module.exports = ClienteService;