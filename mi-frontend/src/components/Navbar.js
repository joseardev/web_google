import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <span className="brand-text">OrderHub</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${isActive('/') || isActive('/dashboard') ? 'active' : ''}`}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </Link>

          <Link to="/pedidos" className={`nav-link ${isActive('/pedidos')}`}>
            <span className="nav-icon">📋</span>
            <span className="nav-text">Pedidos</span>
          </Link>
        </div>

        <div className="navbar-user">
          <div
            className="user-info-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="user-info">
              <span className="user-name">{user?.full_name || user?.email}</span>
              <span className="user-role">{user?.role}</span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  <span>Mi Perfil</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <span className="dropdown-icon">🚪</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
