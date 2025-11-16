// Importa el modelo de Pedido, que interactúa con la base de datos para la entidad Pedido
const PedidoModel = require('../models/pedido.model');
// Importa el modelo de Cliente, necesario para validar que el cliente existe
const ClienteModel = require('../models/cliente.model');
// Importa el modelo de Producto, necesario para obtener precios y nombres de los items
const ProductoModel = require('../models/producto.model');
// Importa el modelo de Stock, crucial para verificar y descontar/devolver el inventario
const StockModel = require('../models/stock.model');

// Define la clase de servicio que contiene la lógica de negocio para los pedidos
class PedidoService {

  /**
   * Método estático principal para crear un nuevo pedido.
   * Realiza validaciones, cálculos de totales y la crucial operación de descuento de stock.
   * @param {object} datosPedido - Objeto con la información del pedido (clienteId, items, descuento, etc.).
   * @param {number|string} usuarioId - El ID del usuario que está creando el pedido (vendedor/empleado).
   * @returns {object} El objeto del pedido creado.
   */
  static async crear(datosPedido, usuarioId) {
    console.log('📝 Servicio: Creando nuevo pedido...');

    // 1. Validar la existencia de campos esenciales
    if (!datosPedido.clienteId || !datosPedido.items || datosPedido.items.length === 0) {
      throw new Error('Cliente e items son requeridos');
    }

    // 2. Verificar que el cliente asociado al pedido existe
    const cliente = await ClienteModel.obtenerPorId(datosPedido.clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    // Inicializar variables para el cálculo de totales
    let subtotal = 0;
    const itemsConDetalles = []; // Almacenará los items con precios y subtotales calculados

    // 3. Bucle para verificar cada ítem del pedido (Stock y Precios)
    for (const item of datosPedido.items) {
      // a. Verificar que el producto exista
      const producto = await ProductoModel.obtenerPorId(item.productoId);
      if (!producto) {
        throw new Error(`Producto ${item.productoId} no encontrado`);
      }

      // b. Verificar stock disponible
      const stock = await StockModel.obtenerPorProducto(item.productoId);
      if (!stock || stock.cantidad < item.cantidad) {
        // Lanza un error si no hay registro de stock o la cantidad pedida excede la disponible
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      // c. Calcular subtotal del ítem
      const itemSubtotal = producto.precio * item.cantidad;
      subtotal += itemSubtotal; // Acumular al subtotal general del pedido

      // d. Almacenar detalles completos del ítem para guardar en el pedido
      itemsConDetalles.push({
        productoId: item.productoId,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal: itemSubtotal
      });
    }

    // 4. Calcular el total final del pedido
    const descuento = datosPedido.descuento || 0;
    const total = subtotal - descuento; // Total = Subtotal - Descuento

    // 5. Crear el registro del pedido en la base de datos
    const pedido = await PedidoModel.crear({
      ...datosPedido, // Incluye datos originales del pedido
      usuarioId, // Asigna el usuario que creó el pedido
      items: itemsConDetalles, // Guarda la lista de items con sus detalles finales
      subtotal,
      descuento,
      total
    });

    // 6. **Lógica Transaccional:** Descontar el stock de cada producto del inventario
    for (const item of itemsConDetalles) {
      // Llama al servicio de stock para disminuir la cantidad
      await StockModel.descontarStock(item.productoId, item.cantidad);
      console.log(`📦 Stock descontado: ${item.nombreProducto} x${item.cantidad}`);
    }

    console.log(`✅ Pedido creado: ${pedido.id} - Total: $${total}`);

    return pedido;
  }

  /**
   * Método estático para obtener todos los pedidos.
   * @returns {array} Un array con todos los objetos de pedido.
   */
  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los pedidos...');
    const pedidos = await PedidoModel.obtenerTodos();
    console.log(`✅ ${pedidos.length} pedidos encontrados`);
    return pedidos;
  }

  /**
   * Método estático para obtener un pedido por su ID.
   * @param {number|string} id - El ID único del pedido.
   * @returns {object} El objeto del pedido encontrado.
   */
  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando pedido ${id}...`);
    const pedido = await PedidoModel.obtenerPorId(id);

    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    console.log(`✅ Pedido encontrado: ${pedido.id}`);
    return pedido;
  }

  /**
   * Método estático para obtener todos los pedidos de un cliente específico.
   * @param {number|string} clienteId - El ID del cliente.
   * @returns {array} Un array de pedidos del cliente.
   */
  static async obtenerPorCliente(clienteId) {
    console.log(`🔍 Servicio: Obteniendo pedidos del cliente ${clienteId}...`);
    const pedidos = await PedidoModel.obtenerPorCliente(clienteId);
    console.log(`✅ ${pedidos.length} pedidos encontrados`);
    return pedidos;
  }

  /**
   * Método estático para obtener pedidos filtrados por un estado específico.
   * @param {string} estado - El estado del pedido (ej: 'entregado', 'pendiente').
   * @returns {array} Un array de pedidos con el estado solicitado.
   */
  static async obtenerPorEstado(estado) {
    console.log(`🔍 Servicio: Obteniendo pedidos con estado ${estado}...`);
    const pedidos = await PedidoModel.obtenerPorEstado(estado);
    console.log(`✅ ${pedidos.length} pedidos encontrados`);
    return pedidos;
  }

  /**
   * Método estático para cambiar el estado de un pedido.
   * Incluye validación de estados permitidos.
   * @param {number|string} id - El ID del pedido.
   * @param {string} nuevoEstado - El nuevo estado a asignar.
   * @returns {object} El objeto del pedido actualizado.
   */
  static async cambiarEstado(id, nuevoEstado) {
    console.log(`📝 Servicio: Cambiando estado del pedido ${id} a ${nuevoEstado}...`);

    // 1. Definir y validar la lista de estados válidos
    const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error('Estado inválido');
    }

    // 2. Llama al método del modelo para actualizar el estado
    const pedido = await PedidoModel.cambiarEstado(id, nuevoEstado);

    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    console.log(`✅ Estado actualizado a: ${nuevoEstado}`);
    return pedido;
  }

  /**
   * Método estático para actualizar cualquier campo de un pedido.
   * Nota: No se recalculan ítems ni totales en esta versión simplificada.
   * @param {number|string} id - El ID del pedido a actualizar.
   * @param {object} datosActualizados - Objeto con los campos a actualizar.
   * @returns {object} El objeto del pedido actualizado.
   */
  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando pedido ${id}...`);

    const pedido = await PedidoModel.actualizar(id, datosActualizados);

    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    console.log(`✅ Pedido actualizado: ${id}`);
    return pedido;
  }

  /**
   * Método estático para cancelar un pedido.
   * **Devuelve el stock de los ítems al inventario.**
   * @param {number|string} id - El ID del pedido a cancelar.
   * @returns {boolean} True si la cancelación/eliminación fue exitosa.
   */
  static async cancelar(id) {
    console.log(`🗑️ Servicio: Cancelando pedido ${id}...`);

    // 1. Obtener el pedido para verificar su estado y recuperar los items
    const pedido = await PedidoModel.obtenerPorId(id);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    // 2. Validar el estado: solo se permite cancelar pedidos que no han sido enviados o entregados
    if (pedido.estado !== 'pendiente' && pedido.estado !== 'procesando') {
      throw new Error('Solo se pueden cancelar pedidos pendientes o en proceso');
    }

    // 3. **Lógica Transaccional:** Devolver el stock al inventario
    for (const item of pedido.items) {
      // Llama al servicio de stock para aumentar la cantidad
      await StockModel.aumentarStock(item.productoId, item.cantidad);
      console.log(`📦 Stock devuelto: ${item.nombreProducto} x${item.cantidad}`);
    }

    // 4. Eliminar/marcar como cancelado el pedido en la base de datos
    // (Se asume que PedidoModel.eliminar() lo marca como cancelado o lo borra físicamente)
    const resultado = await PedidoModel.eliminar(id);

    console.log(`✅ Pedido cancelado: ${id}`);
    return resultado;
  }
}

// Exporta la clase de servicio para que pueda ser utilizada por los controladores
module.exports = PedidoService;