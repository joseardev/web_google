import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import './UsersList.css';

const UsersList = () => {
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    // Solo admins pueden acceder
    if (currentUser?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: !isActive }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      // Actualizar lista
      fetchUsers();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name &&
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="users-container">
          <div className="loading">Cargando usuarios...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="users-container">
        <div className="users-header">
          <h1 className="users-title">Gestión de Usuarios</h1>
          <p className="users-subtitle">
            Administra los usuarios y sus permisos
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="users-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Filtrar por rol:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos</option>
              <option value="admin">Administradores</option>
              <option value="staff">Staff</option>
              <option value="user">Usuarios</option>
            </select>
          </div>
        </div>

        <div className="users-stats">
          <div className="stat-badge">
            <span className="stat-number">{filteredUsers.length}</span>
            <span className="stat-text">
              {filterRole === 'all' ? 'Total' : filterRole}
            </span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">
              {filteredUsers.filter((u) => u.is_active).length}
            </span>
            <span className="stat-text">Activos</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">
              {filteredUsers.filter((u) => !u.is_active).length}
            </span>
            <span className="stat-text">Inactivos</span>
          </div>
        </div>

        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                <div className="user-avatar">
                  {(user.full_name || user.email)[0].toUpperCase()}
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user.full_name || 'Sin nombre'}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
                <span className={`role-badge role-${user.role}`}>
                  {user.role}
                </span>
              </div>

              <div className="user-card-body">
                <div className="user-detail">
                  <span className="detail-label">Estado:</span>
                  <span
                    className={`status-badge ${
                      user.is_active ? 'active' : 'inactive'
                    }`}
                  >
                    {user.is_active ? '✓ Activo' : '✗ Inactivo'}
                  </span>
                </div>

                <div className="user-detail">
                  <span className="detail-label">Creado:</span>
                  <span className="detail-value">
                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>

                {user.is_email_verified !== undefined && (
                  <div className="user-detail">
                    <span className="detail-label">Email verificado:</span>
                    <span className="detail-value">
                      {user.is_email_verified ? '✓ Sí' : '✗ No'}
                    </span>
                  </div>
                )}
              </div>

              <div className="user-card-actions">
                <button
                  onClick={() => handleEditUser(user.id)}
                  className="btn-action btn-edit"
                >
                  <span className="btn-icon">✏️</span>
                  <span>Editar</span>
                </button>

                {user.id !== currentUser?.id && (
                  <button
                    onClick={() => handleToggleActive(user.id, user.is_active)}
                    className={`btn-action ${
                      user.is_active ? 'btn-deactivate' : 'btn-activate'
                    }`}
                  >
                    <span className="btn-icon">
                      {user.is_active ? '🚫' : '✅'}
                    </span>
                    <span>{user.is_active ? 'Desactivar' : 'Activar'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">👥</span>
            <p className="empty-text">No se encontraron usuarios</p>
            <p className="empty-subtext">
              Intenta cambiar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersList;
