import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/productos');
        setProductos(response.data);
        setFilteredProductos(response.data);
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('Error al cargar la lista de productos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredProductos(productos);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await axios.get(`http://localhost:3001/api/productos/buscar?termino=${searchTerm}`);
      setFilteredProductos(response.data);
    } catch (err) {
      console.error('Error al buscar productos:', err);
      setError('Error al buscar productos. Por favor, intente nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    
    if (!e.target.value.trim()) {
      setFilteredProductos(productos);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>Error</h2>
        <p className="error">{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>Catálogo de Productos</h1>
      </div>

      <div className="card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {filteredProductos.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          <div className="product-grid">
            {filteredProductos.map(producto => (
              <div key={producto.id} className="product-card">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p><strong>Precio:</strong> ${producto.precio}</p>
                <p><strong>Stock:</strong> {producto.stock} unidades</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;