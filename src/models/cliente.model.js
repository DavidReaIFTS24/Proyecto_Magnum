// Importa la instancia de la base de datos de Firebase (Firestore)
const { db } = require('../../config/firebase');

// Define el nombre de la colección en Firestore donde se almacenarán los clientes
const COLECCION = 'clientes';

// Define la clase que contiene los métodos para interactuar con la colección de clientes
class ClienteModel {

  /**
   * Método para crear un nuevo registro de cliente en Firestore.
   * Inicializa el estado 'activo' como true y asegura que el email esté en minúsculas.
   * @param {object} datosCliente - Datos del cliente a crear.
   * @returns {object} El objeto del cliente creado.
   */
  static async crear(datosCliente) {
    try {
      // 1. Obtiene una referencia a un nuevo documento, generando automáticamente un ID único
      const clienteRef = db.collection(COLECCION).doc();

      // 2. Define la estructura del nuevo documento/cliente, con valores por defecto
      const nuevoCliente = {
        id: clienteRef.id, // Usa el ID generado por Firestore
        nombre: datosCliente.nombre,
        email: datosCliente.email.toLowerCase(), // Almacena el email en minúsculas
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion || '', // Dirección opcional con valor por defecto
        dni: datosCliente.dni, // Documento Nacional de Identidad
        fechaRegistro: new Date().toISOString(), // Marca de tiempo de registro
        activo: true // Estado por defecto: activo (soft delete)
      };

      // 3. Escribe el nuevo documento en Firestore
      await clienteRef.set(nuevoCliente);
      return nuevoCliente;

    } catch (error) {
      // Captura y relanza cualquier error
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  /**
   * Método para obtener todos los clientes que están activos.
   * @returns {array} Un array de objetos de cliente.
   */
  static async obtenerTodos() {
    try {
      // Realiza una consulta (query) para obtener solo los documentos donde 'activo' es true
      const snapshot = await db.collection(COLECCION)
        .where('activo', '==', true)
        .get();

      const clientes = [];
      // Itera y añade los datos de cada documento al array
      snapshot.forEach(doc => clientes.push(doc.data()));

      return clientes;

    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  /**
   * Método para obtener un cliente por su ID de documento en Firestore.
   * @param {string} id - El ID único del documento.
   * @returns {object|null} El objeto del cliente o null si no existe.
   */
  static async obtenerPorId(id) {
    try {
      // Obtiene un documento específico por su ID
      const doc = await db.collection(COLECCION).doc(id).get();

      if (!doc.exists) {
        return null; // Retorna null si el documento no existe
      }

      return doc.data(); // Retorna los datos del documento

    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  /**
   * Método para obtener un cliente por su DNI.
   * Se utiliza para validar la unicidad antes de crear un cliente.
   * @param {string} dni - El DNI del cliente a buscar.
   * @returns {object|null} El objeto del cliente o null si no se encuentra.
   */
  static async obtenerPorDni(dni) {
    try {
      // Realiza una consulta filtrando por el campo 'dni'
      const snapshot = await db.collection(COLECCION)
        .where('dni', '==', dni)
        .limit(1) // Solo necesitamos un resultado
        .get();

      if (snapshot.empty) {
        return null;
      }

      // Retorna los datos del primer documento encontrado
      return snapshot.docs[0].data();

    } catch (error) {
      throw new Error(`Error al buscar cliente: ${error.message}`);
    }
  }

  /**
   * Método para actualizar los datos de un cliente.
   * Si se actualiza el email, se asegura de convertirlo a minúsculas.
   * @param {string} id - El ID del cliente a actualizar.
   * @param {object} datosActualizados - Los campos a modificar.
   * @returns {object|null} El objeto del cliente actualizado o null.
   */
  static async actualizar(id, datosActualizados) {
    try {
      const clienteRef = db.collection(COLECCION).doc(id);
      const doc = await clienteRef.get();

      if (!doc.exists) {
        return null; // El cliente no existe
      }

      // Pre-proceso: Si se actualiza el email, convertirlo a minúsculas
      if (datosActualizados.email) {
        datosActualizados.email = datosActualizados.email.toLowerCase();
      }

      // Realiza la actualización parcial del documento
      await clienteRef.update(datosActualizados);
      
      // Obtiene el cliente actualizado para retornarlo
      return await this.obtenerPorId(id);

    } catch (error) {
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  /**
   * Método para "eliminar" un cliente realizando un soft delete.
   * Marca el campo 'activo' como false en lugar de borrar el documento.
   * @param {string} id - El ID del cliente a eliminar.
   * @returns {object|null} Un objeto de confirmación o null si no se encontró.
   */
  static async eliminar(id) {
    try {
      const clienteRef = db.collection(COLECCION).doc(id);
      const doc = await clienteRef.get();

      if (!doc.exists) {
        return null; // El cliente no existe
      }

      // Realiza un soft delete: actualiza el campo 'activo' a false
      await clienteRef.update({ activo: false });
      return { id, eliminado: true };

    } catch (error) {
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }
}

// Exporta el modelo para ser utilizado por la capa de servicios
module.exports = ClienteModel;