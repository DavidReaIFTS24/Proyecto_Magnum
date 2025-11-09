const admin = require('firebase-admin');
const path = require('path');

// Cargar credenciales de Firebase
const serviceAccount = require(path.join(__dirname, 'firebase-key.json'));

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Obtener referencia a Firestore
const db = admin.firestore();

// Configuración regional (opcional pero recomendado)
db.settings({ ignoreUndefinedProperties: true });

console.log('🔥 Firebase inicializado correctamente');

module.exports = { admin, db };