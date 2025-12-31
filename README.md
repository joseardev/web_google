# Proyecto Web React + FastAPI en Google Cloud

Aplicación web full-stack con frontend React desplegado en Firebase Hosting y backend FastAPI en Google Cloud Run, ambos con HTTPS automático.

## 🚀 URLs en Producción

- **Frontend**: https://pruebas-19cc6.web.app
- **Backend**: https://mi-fastapi-backend-220000789664.europe-west1.run.app
- **Documentación API**: https://mi-fastapi-backend-220000789664.europe-west1.run.app/docs
- **Repositorio**: https://github.com/joseardev/web_google

## Arquitectura del Proyecto

```
INTERNET
│
├── Frontend: Firebase Hosting
│   └── URL: https://pruebas-19cc6.web.app
│   └── Tecnología: React 18
│   └── HTTPS: Automático ✅
│   └── Hosting: Firebase (Google Cloud)
│
└── Backend: Google Cloud Run
    └── URL: https://mi-fastapi-backend-220000789664.europe-west1.run.app
    └── Tecnología: FastAPI (Python)
    └── HTTPS: Automático ✅
    └── Región: europe-west1
    └── Serverless: Escalado automático
```

## Estructura del Repositorio

```
web_google/
├── mi-frontend/                 # Aplicación React
│   ├── src/
│   │   ├── App.js              # Componente principal con conexión al backend
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── build/                  # Archivos compilados para producción
│   ├── .env                    # Variables de entorno (URL del backend)
│   ├── firebase.json           # Configuración de Firebase Hosting
│   ├── .firebaserc             # Proyecto de Firebase
│   ├── package.json
│   └── INSTRUCCIONES.md        # Guía detallada de despliegue
│
└── README.md                   # Este archivo
```

## Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **Firebase Hosting** - Hosting estático de Google Cloud
- **Fetch API** - Para comunicación con el backend

### Backend
- **FastAPI** - Framework web de Python de alto rendimiento
- **Google Cloud Run** - Serverless container platform
- **Docker** - Containerización de la aplicación
- **CORS Middleware** - Para permitir peticiones desde el frontend

## 📖 Guía de Despliegue

Para instrucciones detalladas de despliegue, consulta [DEPLOY.md](DEPLOY.md)

### Resumen Rápido

**Backend (Cloud Run):**
```bash
cd backend_inicial
gcloud run deploy mi-fastapi-backend --source . --region=europe-west1 --allow-unauthenticated
```

**Frontend (Firebase):**
```bash
cd mi-frontend
npm run build
firebase deploy
```

## Configuración y Desarrollo Local

### Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Python 3.11
- Cuenta de Google Cloud
- Firebase CLI instalado globalmente
- Google Cloud SDK (gcloud)

### Instalación del Frontend

```bash
# Navegar a la carpeta del frontend
cd mi-frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo (opcional)
npm start

# Construir para producción
npm run build
```

### Variables de Entorno

El archivo `.env` contiene la URL del backend:

```env
REACT_APP_API_URL=https://mi-fastapi-backend-220000789664.europe-west1.run.app
```

## Funcionalidades del Frontend

La aplicación React incluye:

1. **Obtener datos del backend** - Botón que hace una petición GET a `/api/ejemplo`
2. **Enviar datos al backend** - Botón que hace una petición POST a `/api/ejemplo`
3. **Manejo de estados** - Loading, errores y datos recibidos
4. **Interfaz responsive** - Diseño adaptable a diferentes pantallas

## Desarrollo Local

### Frontend

```bash
cd mi-frontend
npm start
```

La aplicación se abrirá en http://localhost:3000

### Backend

Para desarrollo local:

```bash
cd backend_inicial
uvicorn main:app --reload --port 8080
```

El backend estará disponible en http://localhost:8080

## Comandos Útiles

### Cloud Run

```bash
# Ver servicios desplegados
gcloud run services list

# Ver logs en tiempo real
gcloud run services logs tail mi-fastapi-backend --region=europe-west1

# Redesplegar backend
cd backend_inicial
gcloud run deploy mi-fastapi-backend --source . --region=europe-west1
```

### Firebase

```bash
# Ver proyectos
firebase projects:list

# Redesplegar frontend
cd mi-frontend
npm run build
firebase deploy
```

### React

```bash
# Desarrollo local
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
```

## Solución de Problemas

### Error de Mixed Content (HTTPS/HTTP)

**Síntoma**: Error en la consola del navegador sobre "Mixed Content"

**Solución**: Asegúrate de que tanto frontend como backend usen HTTPS:
- Frontend: Firebase siempre usa HTTPS ✅
- Backend: Desplegado en Cloud Run usa HTTPS ✅

### Error de CORS

Si ves errores de CORS:

1. Verifica que CORS esté configurado en `backend_inicial/main.py`
2. Redespliega el backend: `gcloud run deploy mi-fastapi-backend --source . --region=europe-west1`

### La app no se conecta al backend

1. Verifica que el backend esté funcionando: `curl https://mi-fastapi-backend-220000789664.europe-west1.run.app/health`
2. Verifica la URL en `mi-frontend/.env`
3. Reconstruye y redespliega el frontend:
   ```bash
   cd mi-frontend
   npm run build
   firebase deploy
   ```

### Error al desplegar a Cloud Run

Si el despliegue falla:

1. Verifica que `Dockerfile` esté en `backend_inicial/`
2. Verifica que `requirements.txt` sea válido
3. Revisa los logs: `gcloud run services logs read mi-fastapi-backend --region=europe-west1`

## Monitoreo y Logs

### Backend (Cloud Run)

```bash
# Ver logs en tiempo real
gcloud run services logs tail mi-fastapi-backend --region=europe-west1

# Ver logs históricos
gcloud run services logs read mi-fastapi-backend --region=europe-west1
```

### Frontend (Firebase)

- Consola de Firebase: https://console.firebase.google.com/

## Costos

### Cloud Run
- ✅ Gratis hasta 2 millones de peticiones/mes
- ✅ Solo pagas por uso (serverless)
- ✅ Se apaga automáticamente cuando no hay tráfico

### Firebase Hosting
- ✅ Gratis hasta 10 GB de almacenamiento
- ✅ Gratis hasta 360 MB/día de transferencia

**Para proyectos pequeños: ¡TODO ES GRATIS!**

## Próximos Pasos

- [ ] Implementar autenticación con Firebase Auth
- [ ] Agregar base de datos (Cloud SQL o Firestore)
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Agregar tests unitarios y de integración
- [ ] Configurar dominio personalizado
- [ ] Agregar monitoreo con Cloud Monitoring

## Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- [Guía de Despliegue Completa](DEPLOY.md)

## Información del Proyecto

- **Proyecto Firebase**: pruebas-19cc6 (pruebasgoogle)
- **Proyecto Google Cloud**: My First Project
- **URL Frontend**: https://pruebas-19cc6.web.app
- **URL Backend**: https://mi-fastapi-backend-220000789664.europe-west1.run.app
- **Backend en Cloud Run**: europe-west1
- **Repositorio**: https://github.com/joseardev/web_google

## Contacto y Soporte

Para más información, consulta el archivo [INSTRUCCIONES.md](mi-frontend/INSTRUCCIONES.md) en la carpeta del frontend.

---

**Última actualización**: Diciembre 2024
