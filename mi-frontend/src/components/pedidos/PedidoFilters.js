import React from 'react';
import './PedidoFilters.css';

const PedidoFilters = ({ filtros, onFiltrosChange }) => {
  const handleChange = (campo, valor) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      estado: '',
      prioridad: '',
      fecha_desde: '',
      fecha_hasta: ''
    });
  };

  return (
    <div className="pedido-filters">
      <h3>🔍 Filtros</h3>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="filtro-estado">Estado:</label>
          <select
            id="filtro-estado"
            value={filtros.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente_confirmacion">Pendiente Confirmación</option>
            <option value="confirmado">Confirmado</option>
            <option value="en_preparacion">En Preparación</option>
            <option value="listo_para_recoger">Listo para Recoger</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-prioridad">Prioridad:</label>
          <select
            id="filtro-prioridad"
            value={filtros.prioridad}
            onChange={(e) => handleChange('prioridad', e.target.value)}
          >
            <option value="">Todas las prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-fecha-desde">Desde:</label>
          <input
            type="date"
            id="filtro-fecha-desde"
            value={filtros.fecha_desde}
            onChange={(e) => handleChange('fecha_desde', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filtro-fecha-hasta">Hasta:</label>
          <input
            type="date"
            id="filtro-fecha-hasta"
            value={filtros.fecha_hasta}
            onChange={(e) => handleChange('fecha_hasta', e.target.value)}
          />
        </div>
      </div>

      <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
        Limpiar Filtros
      </button>
    </div>
  );
};

export default PedidoFilters;
