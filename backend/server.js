const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta_jwt');
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

// Rutas
// Registro de cliente
app.post('/api/clientes/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Verificar si el email ya existe
    const [existingUsers] = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insertar el nuevo cliente
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword]
    );
    
    // Generar token JWT
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET || 'mi_clave_secreta_jwt',
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: 'Cliente registrado correctamente',
      token,
      cliente: { id: result.insertId, nombre, email }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar cliente', error: error.message });
  }
});

// Inicio de sesión
app.post('/api/clientes/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar el cliente por email
    const [clientes] = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
    
    if (clientes.length === 0) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }
    
    const cliente = clientes[0];
    
    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, cliente.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.JWT_SECRET || 'mi_clave_secreta_jwt',
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      cliente: { id: cliente.id, nombre: cliente.nombre, email: cliente.email }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// Obtener todos los clientes (requiere autenticación)
app.get('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const [clientes] = await pool.query('SELECT id, nombre, email FROM clientes');
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener clientes', error: error.message });
  }
});

// Obtener productos
app.get('/api/productos', authenticateToken, async (req, res) => {
  try {
    const [productos] = await pool.query('SELECT * FROM productos');
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// Buscar productos por nombre
app.get('/api/productos/buscar', authenticateToken, async (req, res) => {
  try {
    const { nombre } = req.query;
    const [productos] = await pool.query(
      'SELECT * FROM productos WHERE nombre LIKE ?',
      [`%${nombre}%`]
    );
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ message: 'Error al buscar productos', error: error.message });
  }
});

// Ruta para verificar la conexión a la base de datos
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ message: 'Conexión a la base de datos exitosa' });
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    res.status(500).json({ message: 'Error de conexión a la base de datos', error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});