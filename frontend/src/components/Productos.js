import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { getToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/api/productos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setProductos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setError('Error al cargar la lista de productos');
        setLoading(false);
      }
    };

    fetchProductos();
  }, [getToken]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = getToken();
      let url = 'http://localhost:5000/api/productos';
      
      if (searchTerm.trim()) {
        url = `http://localhost:5000/api/productos/buscar?nombre=${searchTerm}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      setError('Error al buscar productos');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Lista de Productos</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="col-md-4">
              <button 
                className="btn btn-primary w-100" 
                onClick={handleSearch}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {productos.length === 0 ? (
            <p className="text-center">No se encontraron productos</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.descripcion}</td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>{producto.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productos;