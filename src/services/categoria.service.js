const CategoriaModel = require('../models/categoria.model');

class CategoriaService {
  
  static async crear(datosCategoria) {
    console.log('📝 Servicio: Creando nueva categoría...');
    
    if (!datosCategoria.nombre) {
      throw new Error('El nombre es requerido');
    }
    
    const categoria = await CategoriaModel.crear(datosCategoria);
    console.log(`✅ Categoría creada: ${categoria.nombre}`);
    
    return categoria;
  }

  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todas las categorías...');
    const categorias = await CategoriaModel.obtenerTodos();
    console.log(`✅ ${categorias.length} categorías encontradas`);
    return categorias;
  }

  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando categoría ${id}...`);
    const categoria = await CategoriaModel.obtenerPorId(id);
    
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    console.log(`✅ Categoría encontrada: ${categoria.nombre}`);
    return categoria;
  }

  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando categoría ${id}...`);
    
    const categoria = await CategoriaModel.actualizar(id, datosActualizados);
    
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    console.log(`✅ Categoría actualizada: ${categoria.nombre}`);
    return categoria;
  }

  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando categoría ${id}...`);
    
    const resultado = await CategoriaModel.eliminar(id);
    
    if (!resultado) {
      throw new Error('Categoría no encontrada');
    }
    
    console.log(`✅ Categoría eliminada: ${id}`);
    return resultado;
  }
}

module.exports = CategoriaService;