# Guía Completa de Despliegue

Esta guía te muestra cómo desplegar el proyecto completo desde cero.

## Arquitectura Final

```
INTERNET
│
├── Frontend React (Firebase Hosting)
│   └── https://pruebas-19cc6.web.app
│   └── HTTPS Automático ✅
│
└── Backend FastAPI (Cloud Run)
    └── https://mi-fastapi-backend-220000789664.europe-west1.run.app
    └── HTTPS Automático ✅
    └── Serverless (escalado automático)
```

---

## PARTE 1: Desplegar Backend a Cloud Run

### Requisitos Previos
- Google Cloud SDK instalado (`gcloud`)
- Proyecto de Google Cloud creado
- Autenticado en Google Cloud

### Paso 1: Preparar el Backend

Asegúrate de tener estos archivos en la carpeta `backend_inicial/`:

**Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
ENV PORT=8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

**requirements.txt:**
```
fastapi==0.128.0
uvicorn==0.40.0
SQLAlchemy==2.0.45
psycopg2-binary==2.9.11
pydantic==2.12.5
python-dotenv==1.2.1
```

**main.py** debe incluir CORS:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar URLs exactas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Paso 2: Desplegar a Cloud Run

```bash
# Navegar a la carpeta del backend
cd backend_inicial

# Desplegar a Cloud Run (construye y despliega automáticamente)
gcloud run deploy mi-fastapi-backend \
  --source . \
  --region=europe-west1 \
  --allow-unauthenticated \
  --platform=managed

# Durante el despliegue:
# - Service name: Presiona Enter (usa el nombre sugerido)
# - Region: europe-west1
# - Allow unauthenticated: y (Yes)
```

### Paso 3: Obtener la URL del Backend

Al finalizar verás:
```
Service URL: https://mi-fastapi-backend-xxxxx-europe-west1.run.app
```

**¡Copia esta URL!** La necesitarás para el frontend.

### Paso 4: Verificar que funciona

```bash
# Health check
curl https://mi-fastapi-backend-xxxxx-europe-west1.run.app/health

# Ver documentación interactiva
# Abre en el navegador: https://mi-fastapi-backend-xxxxx-europe-west1.run.app/docs
```

---

## PARTE 2: Desplegar Frontend a Firebase

### Requisitos Previos
- Node.js y npm instalados
- Firebase CLI instalado (`npm install -g firebase-tools`)

### Paso 1: Configurar la URL del Backend

Edita el archivo `mi-frontend/.env`:

```env
REACT_APP_API_URL=https://mi-fastapi-backend-xxxxx-europe-west1.run.app
```

**IMPORTANTE**: Reemplaza con la URL real de tu backend de Cloud Run.

### Paso 2: Instalar dependencias

```bash
cd mi-frontend
npm install
```

### Paso 3: Construir el proyecto

```bash
npm run build
```

Esto crea la carpeta `build/` con los archivos optimizados.

### Paso 4: Login en Firebase

```bash
firebase login
```

Se abrirá tu navegador para iniciar sesión con Google.

### Paso 5: Inicializar Firebase (solo primera vez)

```bash
firebase init hosting
```

**Respuestas:**
- Use an existing project or create new project
- Public directory: `build`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No`
- Overwrite index.html: `No`

### Paso 6: Desplegar a Firebase

```bash
firebase deploy
```

Al finalizar verás:
```
Hosting URL: https://pruebas-19cc6.web.app
```

---

## PARTE 3: Actualizar el Proyecto

### Actualizar Backend

```bash
cd backend_inicial

# Hacer cambios en main.py u otros archivos

# Redesplegar
gcloud run deploy mi-fastapi-backend \
  --source . \
  --region=europe-west1 \
  --allow-unauthenticated
```

### Actualizar Frontend

```bash
cd mi-frontend

# Hacer cambios en src/

# Reconstruir
npm run build

# Redesplegar
firebase deploy
```

---

## PARTE 4: Comandos Útiles

### Cloud Run

```bash
# Ver servicios desplegados
gcloud run services list

# Ver logs en tiempo real
gcloud run services logs tail mi-fastapi-backend --region=europe-west1

# Ver detalles del servicio
gcloud run services describe mi-fastapi-backend --region=europe-west1

# Eliminar servicio
gcloud run services delete mi-fastapi-backend --region=europe-west1
```

### Firebase

```bash
# Ver proyectos
firebase projects:list

# Cambiar de proyecto
firebase use <project-id>

# Ver historial de despliegues
firebase hosting:channel:list

# Servir localmente (para pruebas)
npm start  # En localhost:3000
```

### Git

```bash
# Ver estado
git status

# Hacer commit de cambios
git add .
git commit -m "Descripción de cambios"

# Subir a GitHub
git push origin main
```

---

## Solución de Problemas

### Error de CORS en el frontend

**Síntoma**: `Mixed Content` o `CORS policy` en la consola del navegador.

**Solución**:
1. Verifica que ambas URLs usen HTTPS
2. Asegúrate de que CORS esté configurado en `main.py`
3. Reconstruye y redespliega el backend

### Error al desplegar a Cloud Run

**Síntoma**: `ERROR: build failed` o similar.

**Solución**:
1. Verifica que `requirements.txt` esté correcto
2. Verifica que `Dockerfile` esté en la raíz de `backend_inicial/`
3. Asegúrate de estar en la carpeta correcta

### Error al desplegar a Firebase

**Síntoma**: `Error: HTTP Error: 404`

**Solución**:
1. Ejecuta `npm run build` primero
2. Verifica que la carpeta `build/` exista
3. Asegúrate de estar logueado: `firebase login`

### La app no se conecta al backend

**Solución**:
1. Verifica la URL en `.env`
2. Reconstruye el frontend: `npm run build`
3. Redespliega: `firebase deploy`
4. Verifica que el backend esté corriendo: `curl <backend-url>/health`

---

## Flujo de Trabajo Recomendado

### Desarrollo

1. Trabaja localmente:
   ```bash
   # Backend (en otra terminal)
   cd backend_inicial
   uvicorn main:app --reload

   # Frontend
   cd mi-frontend
   npm start
   ```

2. Prueba en `http://localhost:3000`

### Producción

1. Despliega backend primero:
   ```bash
   cd backend_inicial
   gcloud run deploy mi-fastapi-backend --source . --region=europe-west1
   ```

2. Actualiza `.env` con la nueva URL (si cambió)

3. Despliega frontend:
   ```bash
   cd mi-frontend
   npm run build
   firebase deploy
   ```

4. Prueba en `https://pruebas-19cc6.web.app`

---

## Costos

### Cloud Run
- **Gratuito** hasta 2 millones de peticiones/mes
- Solo pagas por uso (serverless)
- Se apaga automáticamente cuando no hay tráfico

### Firebase Hosting
- **Gratuito** hasta 10 GB de almacenamiento
- **Gratuito** hasta 360 MB/día de transferencia

**Para proyectos pequeños: ¡TODO ES GRATIS!** 🎉

---

## Recursos Adicionales

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

---

## Checklist de Despliegue

### Backend
- [ ] `Dockerfile` creado
- [ ] `requirements.txt` actualizado
- [ ] CORS configurado en `main.py`
- [ ] Endpoints `/api/ejemplo` implementados
- [ ] Desplegado a Cloud Run
- [ ] URL de Cloud Run copiada

### Frontend
- [ ] `.env` con URL del backend
- [ ] `npm install` ejecutado
- [ ] `npm run build` ejecutado sin errores
- [ ] Firebase inicializado
- [ ] `firebase deploy` exitoso
- [ ] Aplicación funciona en producción

### Git
- [ ] `.gitignore` configurado
- [ ] Cambios commiteados
- [ ] Código subido a GitHub

---

**¡Listo!** Tu aplicación full-stack está desplegada con HTTPS en ambos extremos.