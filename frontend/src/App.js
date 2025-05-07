import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Productos from './components/Productos';
import Navbar from './components/Navbar';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar onLogout={handleLogout} />}
        <div className="container">
          <Routes>
            <Route path="/login" element={
              isLoggedIn ? 
                <Navigate replace to="/dashboard" /> : 
                <Login onLogin={handleLogin} />
            } />
            <Route path="/register" element={
              isLoggedIn ? 
                <Navigate replace to="/dashboard" /> : 
                <Register onRegisterSuccess={() => {}} />
            } />
            <Route path="/dashboard" element={
              isLoggedIn ? 
                <Dashboard user={user} /> : 
                <Navigate replace to="/login" />
            } />
            <Route path="/productos" element={
              isLoggedIn ? 
                <Productos /> : 
                <Navigate replace to="/login" />
            } />
            <Route path="/" element={<Navigate replace to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;