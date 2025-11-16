// Validaciones comunes
// Exporta el módulo para que pueda ser importado y utilizado en otras partes de la aplicación (ej: en los servicios o controladores)
const validarEmail = (email) => {
  // Expresión regular estándar para un formato de email básico
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Retorna true si la cadena 'email' cumple con el patrón de la regex, false en caso contrario
  return regex.test(email);
};

const validarPassword = (password) => {
  // Verifica que la contraseña no sea nula/indefinida y que su longitud sea de al menos 6 caracteres
  return password && password.length >= 6;
};

const validarPrecio = (precio) => {
  // Verifica que 'precio' sea de tipo 'number' y que su valor sea estrictamente mayor que cero
  return typeof precio === 'number' && precio > 0;
};

const validarCantidad = (cantidad) => {
  // 1. Number.isInteger(cantidad): Verifica que 'cantidad' sea un número entero.
  // 2. cantidad >= 0: Verifica que la cantidad sea cero o un número positivo.
  return Number.isInteger(cantidad) && cantidad >= 0;
};

// Exporta todas las funciones de validación como un objeto
module.exports = {
  validarEmail,
  validarPassword,
  validarPrecio,
  validarCantidad
};