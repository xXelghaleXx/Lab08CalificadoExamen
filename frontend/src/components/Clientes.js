import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { getToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/api/clientes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setClientes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        setError('Error al cargar la lista de clientes');
        setLoading(false);
      }
    };

    fetchClientes();
  }, [getToken]);

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
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>Lista de Clientes</h2>
        </div>
        <div className="col-md-4 text-end">
          <Link to="/productos" className="btn btn-primary">
            Ver Productos
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {clientes.length === 0 ? (
            <p className="text-center">No hay clientes registrados</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.email}</td>
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

export default Clientes;