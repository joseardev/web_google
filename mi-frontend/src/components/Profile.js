import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Profile() {
  const { user, logout, updateProfile, getProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await updateProfile(fullName, email);

    if (result.success) {
      setMessage('Perfil actualizado exitosamente');
      setEditing(false);
      await getProfile(); // Recargar perfil
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setFullName(user.full_name || '');
    setEmail(user.email || '');
    setEditing(false);
    setError('');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="auth-container">
      <div className="profile-box">
        <div className="profile-header">
          <h2>Mi Perfil</h2>
          <button onClick={handleLogout} className="btn-secondary">
            Cerrar Sesión
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="profile-info">
          <div className="info-item">
            <strong>ID:</strong> {user.id}
          </div>
          <div className="info-item">
            <strong>Rol:</strong> <span className="badge">{user.role}</span>
          </div>
          <div className="info-item">
            <strong>Estado:</strong>{' '}
            <span className={user.is_active ? 'badge-success' : 'badge-danger'}>
              {user.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="info-item">
            <strong>Fecha de registro:</strong>{' '}
            {new Date(user.created_at).toLocaleDateString('es-ES')}
          </div>
        </div>

        {!editing ? (
          <div className="profile-details">
            <div className="detail-item">
              <strong>Nombre:</strong>
              <span>{fullName || 'No especificado'}</span>
            </div>
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{email}</span>
            </div>
            <button onClick={() => setEditing(true)} className="btn-primary">
              Editar Perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-group">
              <label>Nombre Completo:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
