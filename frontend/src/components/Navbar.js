import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="nav">
      <div className="container flex flex-between">
        <h2>Sistema de Gestión</h2>
        <ul>
          <li><Link to="/dashboard">Clientes</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><button onClick={onLogout} className="btn btn-secondary">Cerrar Sesión</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;