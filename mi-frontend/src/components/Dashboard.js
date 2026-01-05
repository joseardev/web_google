import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Pedidos',
      icon: '📋',
      description: 'Gestión de pedidos y estados',
      path: '/pedidos',
      color: '#007AFF',
      roles: ['admin', 'staff'],
    },
    {
      title: 'Usuarios',
      icon: '👥',
      description: 'Administrar usuarios y permisos',
      path: '/users',
      color: '#FF2D55',
      roles: ['admin'],
    },
    {
      title: 'Estadísticas',
      icon: '📊',
      description: 'Métricas y análisis de pedidos',
      path: '/estadisticas',
      color: '#34C759',
      roles: ['admin', 'staff'],
    },
    {
      title: 'Configuración',
      icon: '⚙️',
      description: 'Ajustes de la aplicación',
      path: '/configuracion',
      color: '#FF9500',
      roles: ['admin'],
    },
    {
      title: 'Mi Perfil',
      icon: '👤',
      description: 'Información personal y preferencias',
      path: '/profile',
      color: '#5856D6',
      roles: ['admin', 'staff', 'user'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Bienvenido, {user?.full_name || user?.email}
          </h1>
          <p className="dashboard-subtitle">
            Selecciona una opción para comenzar
          </p>
        </div>

        <div className="dashboard-grid">
          {filteredMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="dashboard-card"
              style={{ '--card-color': item.color }}
            >
              <div className="card-icon">{item.icon}</div>
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
              </div>
              <div className="card-arrow">›</div>
            </Link>
          ))}
        </div>

        {user?.role === 'admin' && (
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">📈</span>
              <div className="stat-content">
                <span className="stat-label">Total Pedidos</span>
                <span className="stat-value">-</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-content">
                <span className="stat-label">Completados</span>
                <span className="stat-value">-</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⏳</span>
              <div className="stat-content">
                <span className="stat-label">En Proceso</span>
                <span className="stat-value">-</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
