const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'appdb'
};

// Pool de conexiones
let pool;

// Función para inicializar la conexión a la base de datos
async function initializeDbConnection() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    setTimeout(initializeDbConnection, 5000); // Reintentar después de 5 segundos
  }
}

// Inicializar conexión
initializeDbConnection();

// ===== RUTAS DE API =====

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// === CLIENTES ===

// Registrar cliente
app.post('/api/clientes/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    const [rows] = await pool.query(
      'INSERT INTO clientes (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, password]
    );
    
    res.status(201).json({ 
      message: 'Cliente registrado correctamente',
      clienteId: rows.insertId
    });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
});

// Iniciar sesión
app.post('/api/clientes/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    
    const [rows] = await pool.query(
      'SELECT id, nombre, email FROM clientes WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    res.json({ 
      message: 'Inicio de sesión exitoso',
      cliente: rows[0]
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Listar clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, email, fecha_registro FROM clientes');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// === PRODUCTOS ===

// Listar productos
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Buscar productos por nombre
app.get('/api/productos/buscar', async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino) {
      return res.status(400).json({ error: 'Término de búsqueda requerido' });
    }
    
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE nombre LIKE ? OR descripcion LIKE ?',
      [`%${termino}%`, `%${termino}%`]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API ejecutándose en http://localhost:${port}`);
});