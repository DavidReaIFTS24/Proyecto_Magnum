const PedidoModel = require('../models/pedido.model');
const ClienteModel = require('../models/cliente.model');
const ProductoModel = require('../models/producto.model');
const StockModel = require('../models/stock.model');

class PedidoService {
  
  static async crear(datosPedido, usuarioId) {
    console.log('📝 Servicio: Creando nuevo pedido...');
    
    if (!datosPedido.clienteId || !datosPedido.items || datosPedido.items.length === 0) {
      throw new Error('Cliente e items son requeridos');
    }
    
    // Verificar que el cliente existe
    const cliente = await ClienteModel.obtenerPorId(datosPedido.clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    // Verificar stock y calcular totales
    let subtotal = 0;
    const itemsConDetalles = [];
    
    for (const item of datosPedido.items) {
      // Verificar producto
      const producto = await ProductoModel.obtenerPorId(item.productoId);
      if (!producto) {
        throw new Error(`Producto ${item.productoId} no encontrado`);
      }
      
      // Verificar stock
      const stock = await StockModel.obtenerPorProducto(item.productoId);
      if (!stock || stock.cantidad < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }
      
      const itemSubtotal = producto.precio * item.cantidad;
      subtotal += itemSubtotal;
      
      itemsConDetalles.push({
        productoId: item.productoId,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal: itemSubtotal
      });
    }
    
    // Calcular total
    const descuento = datosPedido.descuento || 0;
    const total = subtotal - descuento;
    
    // Crear pedido
    const pedido = await PedidoModel.crear({
      ...datosPedido,
      usuarioId,
      items: itemsConDetalles,
      subtotal,
      descuento,
      total
    });
    
    // Descontar stock
    for (const item of itemsConDetalles) {
      await StockModel.descontarStock(item.productoId, item.cantidad);
      console.log(`📦 Stock descontado: ${item.nombreProducto} x${item.cantidad}`);
    }
    
    console.log(`✅ Pedido creado: ${pedido.id} - Total: $${total}`);
    
    return pedido;
  }

  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los pedidos...');
    const pedidos = await PedidoModel.obtenerTodos();
    console.log(`✅ ${pedidos.length} pedidos encontrados`);
    return pedidos;
  }

  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando pedido ${id}...`);
    const pedido = await PedidoModel.obtenerPorId(id);
    
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    
    console.log(`✅ Pedido encontrado: ${pedido.id}`);
    return pedido;
  }

  static async obtenerPorCliente(clienteId) {
    console.log(`🔍 Servicio: Obteniendo pedidos del cliente ${clienteId}...`);
    const pedidos = await PedidoModel.obtenerPorCliente(clienteId);
    console.log(`✅ ${pedidos.length} pedidos encontrados`);
    return pedidos;
  }

  static async obtenerPorEstado(estado) {
    console.log(`🔍 Servicio: Obteniendo pedidos con estado ${estado}...`);
    const pedidos = await PedidoModel.obtenerPorEstado(estado);
    console.log(`✅ ${pedidos.length} pedidos encontrados`);
    return pedidos;
  }

  static async cambiarEstado(id, nuevoEstado) {
    console.log(`📝 Servicio: Cambiando estado del pedido ${id} a ${nuevoEstado}...`);
    
    const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error('Estado inválido');
    }
    
    const pedido = await PedidoModel.cambiarEstado(id, nuevoEstado);
    
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    
    console.log(`✅ Estado actualizado a: ${nuevoEstado}`);
    return pedido;
  }

  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando pedido ${id}...`);
    
    const pedido = await PedidoModel.actualizar(id, datosActualizados);
    
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    
    console.log(`✅ Pedido actualizado: ${id}`);
    return pedido;
  }

  static async cancelar(id) {
    console.log(`🗑️ Servicio: Cancelando pedido ${id}...`);
    
    // Obtener el pedido
    const pedido = await PedidoModel.obtenerPorId(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    
    // Solo se puede cancelar si está pendiente o procesando
    if (pedido.estado !== 'pendiente' && pedido.estado !== 'procesando') {
      throw new Error('Solo se pueden cancelar pedidos pendientes o en proceso');
    }
    
    // Devolver stock
    for (const item of pedido.items) {
      await StockModel.aumentarStock(item.productoId, item.cantidad);
      console.log(`📦 Stock devuelto: ${item.nombreProducto} x${item.cantidad}`);
    }
    
    const resultado = await PedidoModel.eliminar(id);
    
    console.log(`✅ Pedido cancelado: ${id}`);
    return resultado;
  }
}

module.exports = PedidoService;