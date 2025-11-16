// Importa la librería JSON Web Token para acceder a los tipos de errores
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

// Middleware global para manejo de errores
// La firma (err, req, res, next) es crucial para que Express la identifique como un manejador de errores
const errorHandler = (err, req, res, next) => {
    // 1. Registro del error para depuración en el servidor
    // Siempre mostramos el stack en la consola del servidor, pero no en la respuesta del cliente
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
    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({ // 401 Unauthorized
            success: false,
            message: 'Token inválido'
        });
    }

    // Si el error es un 'TokenExpiredError' (JWT válido, pero su tiempo de vida ha terminado)
    if (err instanceof TokenExpiredError) {
        return res.status(401).json({ // 401 Unauthorized
            success: false,
            message: 'Token expirado'
        });
    }
    
    // Si tu servicio lanza errores como 'throw new Error("Email ya registrado")'
    // Estos caen aquí. Asumimos que errores lanzados intencionalmente son Bad Request (400),
    // a menos que el error tenga un status code explícito.
    const statusCode = err.status || err.statusCode || 500;
    
    // Si el error viene de un throw new Error() en el servicio y no tiene status,
    // y el mensaje es conocido, podrías querer un 400.
    const finalStatus = (statusCode >= 400 && statusCode < 500) ? statusCode : 500;


    // 3. Manejo de Error por defecto (cualquier otro error no capturado anteriormente)
    res.status(finalStatus).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        // MODIFICACIÓN CLAVE: Se eliminó la inclusión condicional del 'stack'.
        // Ahora, 'stack' NUNCA se enviará en la respuesta JSON al cliente.
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