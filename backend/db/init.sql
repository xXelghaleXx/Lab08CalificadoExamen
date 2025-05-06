-- Crear tablas si no existen
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo para productos
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop HP', 'Laptop HP Core i5, 8GB RAM, 256GB SSD', 799.99, 15),
('Monitor Dell', 'Monitor Dell 24 pulgadas, Full HD', 199.99, 25),
('Teclado Logitech', 'Teclado mecánico Logitech G Pro', 129.99, 30),
('Mouse Logitech', 'Mouse inalámbrico Logitech MX Master', 89.99, 40),
('Auriculares Sony', 'Auriculares inalámbricos con cancelación de ruido', 249.99, 20),
('Tablet Samsung', 'Tablet Samsung Galaxy Tab S7', 649.99, 10),
('Impresora Canon', 'Impresora multifunción Canon PIXMA', 179.99, 8),
('Disco Duro Externo', 'Disco duro externo Seagate 2TB', 79.99, 35),
('Webcam Logitech', 'Webcam Logitech C920 HD Pro', 69.99, 18),
('Router TP-Link', 'Router WiFi TP-Link Archer C7', 89.99, 22);