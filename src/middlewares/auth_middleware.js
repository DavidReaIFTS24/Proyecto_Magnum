const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
  console.log('🔐 Verificando token de autenticación...');
  
  try {
    // Obtener token del header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      console.log('❌ No se proporcionó token');
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar datos del usuario al request
    req.usuario = decoded;
    
    console.log(`✅ Token válido para usuario: ${decoded.email} (${decoded.rol})`);
    next();
    
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para verificar rol ADMIN
const esAdmin = (req, res, next) => {
  console.log('👑 Verificando permisos de administrador...');
  
  if (req.usuario.rol !== 'admin') {
    console.log(`❌ Acceso denegado: usuario ${req.usuario.email} no es admin`);
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  
  console.log(`✅ Usuario ${req.usuario.email} tiene permisos de admin`);
  next();
};

// Middleware para verificar rol ADMIN o EMPLEADO
const esAdminOEmpleado = (req, res, next) => {
  console.log('👔 Verificando permisos de admin o empleado...');
  
  if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'empleado') {
    console.log(`❌ Acceso denegado: usuario ${req.usuario.email} no tiene permisos`);
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador o empleado'
    });
  }
  
  console.log(`✅ Usuario ${req.usuario.email} tiene permisos suficientes`);
  next();
};

module.exports = {
  verificarToken,
  esAdmin,
  esAdminOEmpleado
};