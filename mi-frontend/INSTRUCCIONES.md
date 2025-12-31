# Instrucciones para Desplegar React en Firebase

## Configuración Actual

Tu proyecto React está listo. Ahora sigue estos pasos:

### 1. Configurar la URL del Backend

Edita el archivo `.env` y cambia la URL por la IP de tu servidor de Google Cloud:

```
REACT_APP_API_URL=http://TU_IP_DE_GOOGLE_CLOUD:8000
```

### 2. Probar en desarrollo (opcional)

Para probar localmente antes de desplegar:

```bash
cd mi-frontend
npm start
```

Esto abrirá el navegador en `http://localhost:3000`

### 3. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 4. Login en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para que inicies sesión con tu cuenta de Google.

### 5. Construir el proyecto

```bash
npm run build
```

Esto crea la carpeta `build` con todos los archivos optimizados.

### 6. Inicializar Firebase

```bash
firebase init hosting
```

Responde así:
- ¿Usar un proyecto existente? Si ya tienes uno, selecciónalo. Si no, crea uno nuevo.
- Public directory: `build`
- Configure as single-page app: `yes`
- Set up automatic builds: `no`
- File build/index.html already exists. Overwrite? `no`

### 7. Desplegar a Firebase

```bash
firebase deploy
```

Te dará una URL como: `https://tu-proyecto-xxxxx.web.app`

## Estructura del Proyecto

```
mi-frontend/
├── public/              # Archivos públicos
├── src/
│   ├── App.js          # Componente principal (conecta con backend)
│   ├── App.css
│   └── ...
├── build/              # Se crea con npm run build
├── .env                # Variables de entorno (URL del backend)
├── package.json
└── firebase.json       # Se crea con firebase init
```

## Configurar CORS en tu Backend FastAPI

Para que tu frontend React pueda hacer peticiones a tu backend, necesitas habilitar CORS en FastAPI:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, pon aquí tu URL de Firebase
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ejemplo")
def ejemplo():
    return {"mensaje": "Hola desde FastAPI"}
```

## Flujo Completo

```
TU COMPUTADORA
├── mi-frontend/
│   ├── npm run build → crea /build
│   └── firebase deploy → sube a internet
│
INTERNET
├── Firebase Hosting: https://tu-proyecto.web.app (React)
│   └── Hace peticiones →
└── Google Cloud VM: http://tu-ip:8000 (FastAPI Backend)
```

## Comandos Útiles

```bash
# Ver los logs de Firebase
firebase hosting:channel:list

# Desplegar a un canal de preview (para probar antes de producción)
firebase hosting:channel:deploy preview

# Ver qué proyectos tienes en Firebase
firebase projects:list

# Cambiar de proyecto
firebase use <project-id>
```

## Solución de Problemas

### Error de CORS
Si ves errores de CORS en la consola del navegador, asegúrate de:
1. Tener configurado el middleware CORS en FastAPI
2. Que la URL del backend sea correcta en `.env`

### Error al desplegar
Si `firebase deploy` falla:
1. Verifica que ejecutaste `npm run build` primero
2. Verifica que estés en la carpeta `mi-frontend`
3. Verifica que estés logueado con `firebase login`

### La app no se conecta al backend
1. Verifica que el backend esté corriendo en Google Cloud
2. Verifica que el puerto 8000 esté abierto en el firewall
3. Verifica la URL en `.env`
