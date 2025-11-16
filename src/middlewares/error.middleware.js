// Middleware global para manejo de errores
// La firma (err, req, res, next) es crucial para que Express la identifique como un manejador de errores
const errorHandler = (err, req, res, next) => {
  // 1. Registro del error para depuración en el servidor
  console.error('💥 ERROR CAPTURADO:', err);

  // 2. Manejo de errores específicos

  // Si el error tiene el nombre 'ValidationError' (común en librerías de validación como Joi o Mongoose)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ // 400 Bad Request
      success: false,
      message: 'Error de validación',
      errors: err.errors // Devuelve los detalles específicos de los campos fallidos
    });
  }

  // Si el error es un 'JsonWebTokenError' (JWT inválido, ej: mal formato, token alterado)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ // 401 Unauthorized
      success: false,
      message: 'Token inválido'
    });
  }

  // Si el error es un 'TokenExpiredError' (JWT válido, pero su tiempo de vida ha terminado)
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ // 401 Unauthorized
      success: false,
      message: 'Token expirado'
    });
  }

  // 3. Manejo de Error por defecto (cualquier otro error no capturado anteriormente)
  // Establece el status a 500 (Internal Server Error) o al status que el error pueda traer (ej: 404, 403)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    // Opcional: Incluye el 'stack trace' (pila de llamadas) SOLO en entorno de desarrollo para evitar exponer información sensible en producción
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para rutas no encontradas (404)
// Esta función se coloca al final de la cadena de rutas de Express.
const notFound = (req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ // 404 Not Found
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`
  });
};

// Exporta ambos middlewares para que puedan ser usados en el archivo principal de la aplicación (app.js)
module.exports = {
  errorHandler,
  notFound
};