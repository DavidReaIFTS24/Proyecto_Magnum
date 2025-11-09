// Validaciones comunes
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarPassword = (password) => {
  return password && password.length >= 6;
};

const validarPrecio = (precio) => {
  return typeof precio === 'number' && precio > 0;
};

const validarCantidad = (cantidad) => {
  return Number.isInteger(cantidad) && cantidad >= 0;
};

module.exports = {
  validarEmail,
  validarPassword,
  validarPrecio,
  validarCantidad
};