import React, { useState } from 'react';
import './App.css';

function App() {
  const [mensaje, setMensaje] = useState('');
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // URL del backend desde variable de entorno
  const API_URL = process.env.REACT_APP_API_URL || 'http://34.57.113.255:8000';

  // Función para obtener datos del backend
  const obtenerDatos = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/ejemplo`);
      if (!response.ok) {
        throw new Error('Error al obtener datos');
      }
      const data = await response.json();
      setDatos(data);
      setMensaje('Datos obtenidos correctamente');
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Función para enviar datos al backend
  const enviarDatos = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/ejemplo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: 'Usuario', mensaje: 'Hola desde React' }),
      });
      if (!response.ok) {
        throw new Error('Error al enviar datos');
      }
      const data = await response.json();
      setMensaje('Datos enviados: ' + JSON.stringify(data));
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Frontend React</h1>
        <p>Conectado con FastAPI Backend</p>

        <div style={{ margin: '20px' }}>
          <button onClick={obtenerDatos} disabled={cargando}>
            {cargando ? 'Cargando...' : 'Obtener Datos del Backend'}
          </button>

          <button onClick={enviarDatos} disabled={cargando} style={{ marginLeft: '10px' }}>
            {cargando ? 'Enviando...' : 'Enviar Datos al Backend'}
          </button>
        </div>

        {mensaje && <p style={{ color: 'lightgreen' }}>{mensaje}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {datos.length > 0 && (
          <div>
            <h3>Datos recibidos:</h3>
            <pre>{JSON.stringify(datos, null, 2)}</pre>
          </div>
        )}

        <div style={{ marginTop: '40px', fontSize: '14px', color: '#888' }}>
          <p>Recuerda cambiar TU_IP_AQUI por la IP de tu servidor</p>
          <p>Archivo: src/App.js línea 12</p>
        </div>
      </header>
    </div>
  );
}

export default App;
