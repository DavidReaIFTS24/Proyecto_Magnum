// Importa la librería JSON Web Token para la verificación y decodificación
const jwt = require('jsonwebtoken');

// --- 1. Middleware de Autenticación (Verifica el Token) ---

/**
 * Middleware para verificar la validez de un token JWT en la cabecera 'Authorization'.
 * Si es válido, decodifica el payload y lo adjunta a req.usuario.
 * @param {object} req - Objeto de la petición.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 */
const verificarToken = (req, res, next) => {
  console.log('🔐 Verificando token de autenticación...');

  try {
    // Intenta obtener el token del header 'Authorization', esperando el formato 'Bearer TOKEN'
    const authHeader = req.headers.authorization;
    // .split(' ')[1] extrae la segunda parte ('TOKEN')
    const token = authHeader?.split(' ')[1]; 

    // 1. Verificar si el token existe
    if (!token) {
      console.log('❌ No se proporcionó token');
      return res.status(401).json({ // 401 Unauthorized
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // 2. Verificar y decodificar el token usando la clave secreta del entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Si es válido, adjuntar el payload decodificado al objeto de la petición
    // Esto hace que la información del usuario esté disponible para las siguientes funciones (req.usuario)
    req.usuario = decoded;

    console.log(`✅ Token válido para usuario: ${decoded.email} (${decoded.rol})`);
    next(); // Continúa con la ejecución de la ruta
    
  } catch (error) {
    // Si jwt.verify falla (token inválido o expirado), se captura el error
    console.log('❌ Token inválido:', error.message);
    // Nota: El manejador de errores global puede manejar errores de JWT,
    // pero responder aquí es una alternativa rápida para este middleware.
    return res.status(401).json({ // 401 Unauthorized
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// --- 2. Middleware de Autorización (Rol: ADMIN) ---

/**
 * Middleware para restringir el acceso solo a usuarios con rol 'admin'.
 * Depende de que 'verificarToken' se haya ejecutado previamente para que exista req.usuario.
 * @param {object} req - Objeto de la petición (debe contener req.usuario).
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 */
const esAdmin = (req, res, next) => {
  console.log('👑 Verificando permisos de administrador...');

  // Verifica el campo 'rol' que fue adjuntado por verificarToken
  if (req.usuario.rol !== 'admin') {
    console.log(`❌ Acceso denegado: usuario ${req.usuario.email} no es admin`);
    return res.status(403).json({ // 403 Forbidden
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }

  console.log(`✅ Usuario ${req.usuario.email} tiene permisos de admin`);
  next(); // Permite el acceso
};

// --- 3. Middleware de Autorización (Rol: ADMIN o EMPLEADO) ---

/**
 * Middleware para restringir el acceso a usuarios con rol 'admin' o 'empleado'.
 * @param {object} req - Objeto de la petición (debe contener req.usuario).
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 */
const esAdminOEmpleado = (req, res, next) => {
  console.log('👔 Verificando permisos de admin o empleado...');
  
  // Verifica si el rol NO es 'admin' Y NO es 'empleado'
  if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'empleado') {
    console.log(`❌ Acceso denegado: usuario ${req.usuario.email} no tiene permisos`);
    return res.status(403).json({ // 403 Forbidden
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador o empleado'
    });
  }

  console.log(`✅ Usuario ${req.usuario.email} tiene permisos suficientes`);
  next(); // Permite el acceso
};

// Exporta todos los middlewares
module.exports = {
  verificarToken,
  esAdmin,
  esAdminOEmpleado
};