require('dotenv').config();
const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Iniciando seeding de la base de datos...\n');

  try {
    // ============================================
    // 1. USUARIOS
    // ============================================
    console.log('👥 Creando usuarios...');
    
    const salt = await bcrypt.genSalt(10);
    
    const admin = {
      id: 'admin001',
      nombre: 'Admin Principal',
      email: 'admin@magnum.com',
      password: await bcrypt.hash('admin123', salt),
      rol: 'admin',
      activo: true,
      fechaCreacion: new Date().toISOString(),
      ultimoAcceso: null
    };
    
    const empleado = {
      id: 'emp001',
      nombre: 'Juan Empleado',
      email: 'juan@magnum.com',
      password: await bcrypt.hash('empleado123', salt),
      rol: 'empleado',
      activo: true,
      fechaCreacion: new Date().toISOString(),
      ultimoAcceso: null
    };
    
    await db.collection('usuarios').doc('admin001').set(admin);
    await db.collection('usuarios').doc('emp001').set(empleado);
    console.log('✅ Usuarios creados');

    // ============================================
    // 2. CATEGORÍAS
    // ============================================
    console.log('\n📦 Creando categorías...');
    
    const categorias = [
      {
        id: 'cat001',
        nombre: 'Carteras',
        descripcion: 'Carteras de cuero genuino de alta calidad',
        activa: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'cat002',
        nombre: 'Billeteras',
        descripcion: 'Billeteras de cuero para hombre y mujer',
        activa: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'cat003',
        nombre: 'Mochilas',
        descripcion: 'Mochilas de cuero estilo urbano',
        activa: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'cat004',
        nombre: 'Cinturones',
        descripcion: 'Cinturones de cuero genuino',
        activa: true,
        fechaCreacion: new Date().toISOString()
      }
    ];
    
    for (const cat of categorias) {
      await db.collection('categorias').doc(cat.id).set(cat);
    }
    console.log('✅ Categorías creadas');

    // ============================================
    // 3. PRODUCTOS
    // ============================================
    console.log('\n🛍️ Creando productos...');
    
    const productos = [
      {
        id: 'prod001',
        nombre: 'Cartera Magnum Executive',
        descripcion: 'Cartera de cuero vacuno premium con múltiples compartimentos',
        categoriaId: 'cat001',
        precio: 45000,
        color: 'Negro',
        material: 'Cuero vacuno',
        dimensiones: '30x20x8 cm',
        imagen: '',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'prod002',
        nombre: 'Cartera Elegance',
        descripcion: 'Cartera de cuero para dama con diseño elegante',
        categoriaId: 'cat001',
        precio: 38000,
        color: 'Marrón',
        material: 'Cuero genuino',
        dimensiones: '28x18x7 cm',
        imagen: '',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'prod003',
        nombre: 'Billetera Slim Classic',
        descripcion: 'Billetera compacta de cuero genuino',
        categoriaId: 'cat002',
        precio: 15000,
        color: 'Negro',
        material: 'Cuero genuino',
        dimensiones: '11x8x2 cm',
        imagen: '',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'prod004',
        nombre: 'Billetera Premium',
        descripcion: 'Billetera de cuero con protección RFID',
        categoriaId: 'cat002',
        precio: 18000,
        color: 'Marrón',
        material: 'Cuero vacuno',
        dimensiones: '12x9x2 cm',
        imagen: '',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'prod005',
        nombre: 'Mochila Urban Pro',
        descripcion: 'Mochila de cuero con compartimento para laptop',
        categoriaId: 'cat003',
        precio: 65000,
        color: 'Negro',
        material: 'Cuero vacuno y lona',
        dimensiones: '45x35x15 cm',
        imagen: '',
        activo: true,
        fechaCreacion: new Date().toISOString()
      },
      {
        id: 'prod006',
        nombre: 'Cinturón Executive',
        descripcion: 'Cinturón de cuero con hebilla de acero inoxidable',
        categoriaId: 'cat004',
        precio: 12000,
        color: 'Negro',
        material: 'Cuero vacuno',
        dimensiones: '110cm largo x 3.5cm ancho',
        imagen: '',
        activo: true,
        fechaCreacion: new Date().toISOString()
      }
    ];
    
    for (const prod of productos) {
      await db.collection('productos').doc(prod.id).set(prod);
    }
    console.log('✅ Productos creados');

    // ============================================
    // 4. STOCK
    // ============================================
    console.log('\n📊 Creando registros de stock...');
    
    const stocks = [
      {
        id: 'stock001',
        productoId: 'prod001',
        cantidad: 25,
        ubicacion: 'Depósito A - Estante 1',
        stockMinimo: 5,
        ultimaActualizacion: new Date().toISOString()
      },
      {
        id: 'stock002',
        productoId: 'prod002',
        cantidad: 18,
        ubicacion: 'Depósito A - Estante 1',
        stockMinimo: 5,
        ultimaActualizacion: new Date().toISOString()
      },
      {
        id: 'stock003',
        productoId: 'prod003',
        cantidad: 50,
        ubicacion: 'Depósito A - Estante 2',
        stockMinimo: 10,
        ultimaActualizacion: new Date().toISOString()
      },
      {
        id: 'stock004',
        productoId: 'prod004',
        cantidad: 35,
        ubicacion: 'Depósito A - Estante 2',
        stockMinimo: 10,
        ultimaActualizacion: new Date().toISOString()
      },
      {
        id: 'stock005',
        productoId: 'prod005',
        cantidad: 12,
        ubicacion: 'Depósito B - Estante 1',
        stockMinimo: 3,
        ultimaActualizacion: new Date().toISOString()
      },
      {
        id: 'stock006',
        productoId: 'prod006',
        cantidad: 40,
        ubicacion: 'Depósito A - Estante 3',
        stockMinimo: 8,
        ultimaActualizacion: new Date().toISOString()
      }
    ];
    
    for (const stock of stocks) {
      await db.collection('stock').doc(stock.id).set(stock);
    }
    console.log('✅ Stock creado');

    // ============================================
    // 5. CLIENTES
    // ============================================
    console.log('\n👥 Creando clientes...');
    
    const clientes = [
      {
        id: 'cli001',
        nombre: 'María González',
        email: 'maria.gonzalez@email.com',
        telefono: '+5491123456789',
        direccion: 'Av. Libertador 1234, CABA',
        dni: '35123456',
        fechaRegistro: new Date().toISOString(),
        activo: true
      },
      {
        id: 'cli002',
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        telefono: '+5491198765432',
        direccion: 'Av. Santa Fe 2500, CABA',
        dni: '28987654',
        fechaRegistro: new Date().toISOString(),
        activo: true
      },
      {
        id: 'cli003',
        nombre: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        telefono: '+5491155667788',
        direccion: 'Calle Corrientes 1500, CABA',
        dni: '33445566',
        fechaRegistro: new Date().toISOString(),
        activo: true
      },
      {
        id: 'cli004',
        nombre: 'Jorge López',
        email: 'jorge.lopez@email.com',
        telefono: '+5491144332211',
        direccion: 'Av. Cabildo 3000, CABA',
        dni: '30112233',
        fechaRegistro: new Date().toISOString(),
        activo: true
      }
    ];
    
    for (const cliente of clientes) {
      await db.collection('clientes').doc(cliente.id).set(cliente);
    }
    console.log('✅ Clientes creados');

    // ============================================
    // 6. PEDIDOS
    // ============================================
    console.log('\n🛒 Creando pedidos de ejemplo...');
    
    const pedidos = [
      {
        id: 'ped001',
        clienteId: 'cli001',
        usuarioId: 'emp001',
        fecha: new Date().toISOString(),
        estado: 'entregado',
        items: [
          {
            productoId: 'prod001',
            nombreProducto: 'Cartera Magnum Executive',
            cantidad: 1,
            precioUnitario: 45000,
            subtotal: 45000
          },
          {
            productoId: 'prod003',
            nombreProducto: 'Billetera Slim Classic',
            cantidad: 2,
            precioUnitario: 15000,
            subtotal: 30000
          }
        ],
        subtotal: 75000,
        descuento: 5000,
        total: 70000,
        metodoPago: 'tarjeta_credito',
        observaciones: 'Cliente frecuente',
        direccionEntrega: 'Av. Libertador 1234, CABA'
      },
      {
        id: 'ped002',
        clienteId: 'cli002',
        usuarioId: 'emp001',
        fecha: new Date().toISOString(),
        estado: 'procesando',
        items: [
          {
            productoId: 'prod005',
            nombreProducto: 'Mochila Urban Pro',
            cantidad: 1,
            precioUnitario: 65000,
            subtotal: 65000
          }
        ],
        subtotal: 65000,
        descuento: 0,
        total: 65000,
        metodoPago: 'transferencia',
        observaciones: 'Enviar antes del 20/11',
        direccionEntrega: 'Av. Santa Fe 2500, CABA'
      },
      {
        id: 'ped003',
        clienteId: 'cli003',
        usuarioId: 'admin001',
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        items: [
          {
            productoId: 'prod002',
            nombreProducto: 'Cartera Elegance',
            cantidad: 1,
            precioUnitario: 38000,
            subtotal: 38000
          },
          {
            productoId: 'prod006',
            nombreProducto: 'Cinturón Executive',
            cantidad: 1,
            precioUnitario: 12000,
            subtotal: 12000
          }
        ],
        subtotal: 50000,
        descuento: 2000,
        total: 48000,
        metodoPago: 'efectivo',
        observaciones: '',
        direccionEntrega: 'Calle Corrientes 1500, CABA'
      }
    ];
    
    for (const pedido of pedidos) {
      await db.collection('pedidos').doc(pedido.id).set(pedido);
    }
    console.log('✅ Pedidos creados');

    // ============================================
    // RESUMEN
    // ============================================
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   ✅ SEEDING COMPLETADO EXITOSAMENTE   ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('\n📊 Datos creados:');
    console.log('   👥 2 usuarios (1 admin, 1 empleado)');
    console.log('   📦 4 categorías');
    console.log('   🛍️  6 productos');
    console.log('   📊 6 registros de stock');
    console.log('   👥 4 clientes');
    console.log('   🛒 3 pedidos');
    console.log('\n🔐 Credenciales:');
    console.log('   Admin:    admin@magnum.com / admin123');
    console.log('   Empleado: juan@magnum.com / empleado123');
    console.log('\n🚀 Ya puedes probar la API!');
    
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  }
  
  process.exit(0);
}

// Ejecutar seeding
seed();