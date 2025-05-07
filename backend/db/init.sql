CREATE DATABASE IF NOT EXISTS appdb;
USE appdb;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

-- Insertar algunos datos de ejemplo
INSERT INTO clientes (nombre, email, password) VALUES
  ('Usuario Demo', 'demo@example.com', 'password123'),
  ('Juan Pérez', 'juan@example.com', 'password123'),
  ('María López', 'maria@example.com', 'password123');

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
  ('Laptop', 'Laptop de última generación', 1200.50, 10),
  ('Smartphone', 'Teléfono inteligente', 600.99, 20),
  ('Tablet', 'Tablet de 10 pulgadas', 350.75, 15),
  ('Monitor', 'Monitor 24 pulgadas', 200.00, 8),
  ('Teclado', 'Teclado mecánico', 50.99, 30);