import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado en localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/clientes/registro', userData);
      const { token, cliente } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(cliente));
      
      setUser(cliente);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar el usuario'
      };
    }
  };

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/clientes/login', credentials);
      const { token, cliente } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(cliente));
      
      setUser(cliente);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Función para obtener el token JWT
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const authContextValue = {
    user,
    loading,
    register,
    login,
    logout,
    getToken,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};