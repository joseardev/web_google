import React from 'react';
import './PedidoCard.css';

const PedidoCard = ({ pedido, onCambiarEstado }) => {
  // Función para obtener el color según la prioridad
  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return '#dc3545'; // Rojo
      case 'media':
        return '#ffc107'; // Amarillo
      case 'baja':
        return '#28a745'; // Verde
      default:
        return '#6c757d'; // Gris
    }
  };

  // Función para obtener el color según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente_confirmacion':
        return '#ffc107';
      case 'confirmado':
        return '#17a2b8';
      case 'en_preparacion':
        return '#007bff';
      case 'listo_para_recoger':
        return '#28a745';
      case 'completado':
        return '#6c757d';
      case 'cancelado':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return null;
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para formatear fecha legible
  const formatearFechaLegible = (fecha) => {
    if (!fecha) return null;
    const date = new Date(fecha);
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    // Comparar solo las fechas, no las horas
    const fechaSolo = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const hoySolo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const mananaSolo = new Date(manana.getFullYear(), manana.getMonth(), manana.getDate());

    if (fechaSolo.getTime() === hoySolo.getTime()) {
      return 'hoy';
    } else if (fechaSolo.getTime() === mananaSolo.getTime()) {
      return 'mañana';
    } else {
      return formatearFecha(fecha);
    }
  };

  // Opciones de estados disponibles
  const estadosDisponibles = [
    { value: 'pendiente_confirmacion', label: 'Pendiente Confirmación' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'en_preparacion', label: 'En Preparación' },
    { value: 'listo_para_recoger', label: 'Listo para Recoger' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    if (nuevoEstado !== pedido.estado) {
      onCambiarEstado(pedido.id, nuevoEstado);
    }
  };

  return (
    <div className="pedido-card">
      <div className="pedido-card-header">
        <div className="pedido-numero">
          Pedido #{pedido.id}
        </div>
        <div
          className="pedido-prioridad"
          style={{ backgroundColor: getPrioridadColor(pedido.prioridad) }}
        >
          {pedido.prioridad.toUpperCase()}
        </div>
      </div>

      <div className="pedido-card-body">
        <div className="pedido-items">
          <strong>📦 Items:</strong>
          <p>{pedido.resumen_items}</p>
        </div>

        <div className="pedido-info">
          <div className="info-item">
            <strong>👤 Cliente:</strong>
            <span>{pedido.telegram_username || `ID: ${pedido.telegram_user_id}`}</span>
          </div>

          {pedido.fecha_solicitada && (
            <div className="info-item">
              <strong>📅 Para:</strong>
              <span>
                {formatearFechaLegible(pedido.fecha_solicitada)}
                {pedido.hora_solicitada && ` a las ${pedido.hora_solicitada}`}
              </span>
            </div>
          )}

          {pedido.asignado_a && (
            <div className="info-item">
              <strong>👨‍💼 Asignado a:</strong>
              <span>{pedido.asignado_a}</span>
            </div>
          )}

          <div className="info-item">
            <strong>🕐 Creado:</strong>
            <span>{formatearFecha(pedido.fecha_creacion)}</span>
          </div>

          {pedido.notas_adicionales && (
            <div className="info-item">
              <strong>📝 Notas:</strong>
              <p className="notas">{pedido.notas_adicionales}</p>
            </div>
          )}
        </div>

        <div className="pedido-estado-select">
          <label htmlFor={`estado-${pedido.id}`}>
            <strong>Estado:</strong>
          </label>
          <select
            id={`estado-${pedido.id}`}
            value={pedido.estado}
            onChange={handleEstadoChange}
            style={{
              backgroundColor: getEstadoColor(pedido.estado),
              color: 'white'
            }}
          >
            {estadosDisponibles.map(estado => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PedidoCard;
