require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./src/middlewares/error.middleware');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const categoriaRoutes = require('./src/routes/categoria.routes');
const productoRoutes = require('./src/routes/producto.routes');
const clienteRoutes = require('./src/routes/cliente.routes');
const stockRoutes = require('./src/routes/stock.routes');
const pedidoRoutes = require('./src/routes/pedido.routes');

// Inicializar Firebase
require('./config/firebase');

// Crear aplicación Express
const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permitir peticiones desde cualquier origen
app.use(cors());

// Parser de JSON
app.use(express.json());

// Parser de datos URL encoded
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// RUTA PRINCIPAL
// ============================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Marroquinería Magnum',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
      clientes: '/api/clientes',
      stock: '/api/stock',
      pedidos: '/api/pedidos'
    },
    documentation: 'Ver README.md para documentación completa'
  });
});

// ============================================
// RUTAS DE LA API
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/pedidos', pedidoRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada
app.use(notFound);

// Manejador global de errores
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║                                                ║');
  console.log('║     🏪 API MARROQUINERÍA MAGNUM 🏪             ║');
  console.log('║                                                ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado: ${new Date().toLocaleString()}`);
  console.log('\n📚 Endpoints disponibles:');
  console.log('   POST   /api/auth/register');
  console.log('   POST   /api/auth/login');
  console.log('   GET    /api/auth/perfil');
  console.log('   GET    /api/usuarios');
  console.log('   GET    /api/categorias');
  console.log('   GET    /api/productos');
  console.log('   GET    /api/clientes');
  console.log('   GET    /api/stock');
  console.log('   GET    /api/pedidos');
  console.log('\n💡 Tip: Usa Postman para probar los endpoints');
  console.log('════════════════════════════════════════════════\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ ERROR NO MANEJADO:', err);
  process.exit(1);
});

module.exports = app;