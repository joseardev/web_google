import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PedidoCard from './PedidoCard';
import PedidoFilters from './PedidoFilters';
import './PedidosList.css';

const PedidosList = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    fecha_desde: '',
    fecha_hasta: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // Función para cargar pedidos
  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Construir URL con filtros
      const params = new URLSearchParams();

      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
      if (filtros.fecha_desde) params.append('fecha_desde', new Date(filtros.fecha_desde).toISOString());
      if (filtros.fecha_hasta) params.append('fecha_hasta', new Date(filtros.fecha_hasta).toISOString());

      params.append('limit', '100');
      params.append('offset', '0');

      const url = `${API_URL}/api/telegram/pedidos?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('No tienes permisos para ver pedidos. Necesitas rol admin o staff.');
        }
        throw new Error('Error al cargar pedidos');
      }

      const data = await response.json();
      setPedidos(data.pedidos);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/telegram/estadisticas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEstadisticas(data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  // Función para cambiar estado de pedido
  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/api/telegram/pedidos/${pedidoId}/cambiar-estado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nuevo_estado: nuevoEstado
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado del pedido');
      }

      // Recargar pedidos después del cambio
      await cargarPedidos();
      await cargarEstadisticas();

      alert(`Pedido #${pedidoId} actualizado correctamente. Se ha enviado una notificación al cliente.`);
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Error:', err);
    }
  };

  // Efecto para cargar pedidos cuando cambian los filtros
  useEffect(() => {
    cargarPedidos();
    cargarEstadisticas();
  }, [filtros]);

  if (loading && pedidos.length === 0) {
    return (
      <div className="pedidos-container">
        <div className="loading">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="pedidos-container">
      <div className="pedidos-header">
        <h1>📦 Gestión de Pedidos de Telegram</h1>
        <button className="btn-recargar" onClick={() => { cargarPedidos(); cargarEstadisticas(); }}>
          🔄 Recargar
        </button>
      </div>

      {estadisticas && (
        <div className="estadisticas-panel">
          <div className="stat-card">
            <div className="stat-value">{estadisticas.total_pedidos}</div>
            <div className="stat-label">Total Pedidos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{estadisticas.pedidos_por_estado.pendiente_confirmacion || 0}</div>
            <div className="stat-label">Por Confirmar</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{estadisticas.pedidos_por_estado.en_preparacion || 0}</div>
            <div className="stat-label">En Preparación</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{estadisticas.pedidos_por_estado.listo_para_recoger || 0}</div>
            <div className="stat-label">Listos</div>
          </div>
        </div>
      )}

      <PedidoFilters filtros={filtros} onFiltrosChange={setFiltros} />

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {loading && (
        <div className="loading">Actualizando...</div>
      )}

      {!loading && pedidos.length === 0 && (
        <div className="no-pedidos">
          No hay pedidos que coincidan con los filtros seleccionados.
        </div>
      )}

      <div className="pedidos-grid">
        {pedidos.map(pedido => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onCambiarEstado={handleCambiarEstado}
          />
        ))}
      </div>
    </div>
  );
};

export default PedidosList;
