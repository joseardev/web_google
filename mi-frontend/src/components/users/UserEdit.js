import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar';
import './UserEdit.css';

const UserEdit = () => {
  const { userId } = useParams();
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'user',
    is_active: true,
  });

  const [passwordData, setPasswordData] = useState({
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    // Solo admins pueden acceder
    if (currentUser?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUser();
  }, [userId, currentUser, navigate]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener usuario');
      }

      const data = await response.json();
      setFormData({
        email: data.email || '',
        full_name: data.full_name || '',
        role: data.role || 'user',
        is_active: data.is_active !== false,
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar usuario');
      }

      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            new_password: passwordData.new_password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al cambiar contraseña');
      }

      setSuccess('Contraseña cambiada exitosamente');
      setPasswordData({ new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="user-edit-container">
          <div className="loading">Cargando usuario...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="user-edit-container">
        <div className="user-edit-header">
          <button onClick={() => navigate('/users')} className="btn-back">
            <span className="back-icon">←</span>
            <span>Volver</span>
          </button>
          <h1 className="user-edit-title">Editar Usuario</h1>
          <p className="user-edit-subtitle">
            Modifica la información del usuario
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="edit-sections">
          {/* Información General */}
          <div className="edit-section">
            <h2 className="section-title">Información General</h2>
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rol</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="user">Usuario</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Administrador</option>
                </select>
                <p className="form-hint">
                  {formData.role === 'admin' &&
                    'Administrador: Acceso completo al sistema'}
                  {formData.role === 'staff' &&
                    'Staff: Puede gestionar pedidos y ver estadísticas'}
                  {formData.role === 'user' && 'Usuario: Acceso básico'}
                </p>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">Usuario activo</span>
                </label>
                <p className="form-hint">
                  {formData.is_active
                    ? 'El usuario puede iniciar sesión'
                    : 'El usuario no puede iniciar sesión'}
                </p>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/users')}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>

          {/* Cambiar Contraseña */}
          <div className="edit-section">
            <h2 className="section-title">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordSubmit} className="edit-form">
              <div className="form-group">
                <label className="form-label">Nueva Contraseña</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Repite la contraseña"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-warning"
                  disabled={
                    saving ||
                    !passwordData.new_password ||
                    !passwordData.confirm_password
                  }
                >
                  {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEdit;
