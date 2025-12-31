# Proyecto Web React + FastAPI en Google Cloud

Aplicación web full-stack con frontend React desplegado en Firebase Hosting y backend FastAPI en Google Cloud Compute Engine.

## Arquitectura del Proyecto

```
INTERNET
│
├── Frontend: Firebase Hosting
│   └── URL: https://pruebas-19cc6.web.app
│   └── Tecnología: React 18
│   └── Hosting: Firebase (Google Cloud)
│
└── Backend: Google Cloud Compute Engine
    └── URL: http://34.57.113.255:8000
    └── Tecnología: FastAPI (Python)
    └── Servidor: fastapi-server (us-central1-a)
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
- **Google Cloud Compute Engine** - Servidor virtual (VM)
- **CORS Middleware** - Para permitir peticiones desde el frontend

## Configuración y Despliegue

### Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Cuenta de Google Cloud
- Firebase CLI instalado globalmente

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
REACT_APP_API_URL=http://34.57.113.255:8000
```

### Desplegar Frontend a Firebase

```bash
# Asegurarse de estar en la carpeta mi-frontend
cd mi-frontend

# Iniciar sesión en Firebase (solo primera vez)
firebase login

# Desplegar a Firebase Hosting
firebase deploy
```

Después del despliegue, tu aplicación estará disponible en:
- **URL principal**: https://pruebas-19cc6.web.app
- **URL alternativa**: https://pruebas-19cc6.firebaseapp.com

### Configuración del Backend FastAPI

Para que el frontend pueda comunicarse con el backend, asegúrate de que tu backend FastAPI tenga CORS configurado:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pruebas-19cc6.web.app",
        "https://pruebas-19cc6.firebaseapp.com",
        "http://localhost:3000"  # Para desarrollo local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend FastAPI funcionando"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/ejemplo")
def get_ejemplo():
    return {"mensaje": "Datos desde el backend", "data": [1, 2, 3]}

@app.post("/api/ejemplo")
def post_ejemplo(data: dict):
    return {"recibido": data, "status": "success"}
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

Asegúrate de que tu backend FastAPI esté corriendo:

```bash
# En tu servidor de Google Cloud
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Comandos Útiles

### Firebase

```bash
# Ver proyectos de Firebase
firebase projects:list

# Cambiar de proyecto
firebase use <project-id>

# Ver información del hosting
firebase hosting:channel:list

# Desplegar a un canal de preview
firebase hosting:channel:deploy preview

# Ver logs
firebase hosting:channel:open preview
```

### React

```bash
# Instalar nueva dependencia
npm install <paquete>

# Actualizar dependencias
npm update

# Ejecutar tests
npm test

# Construir para producción
npm run build

# Analizar bundle size
npm run build -- --stats
```

## Solución de Problemas

### Error de CORS

Si ves errores de CORS en la consola del navegador:

1. Verifica que el middleware CORS esté configurado en FastAPI
2. Asegúrate de que la URL de Firebase esté en `allow_origins`
3. Reinicia el servidor backend después de hacer cambios

### Error al desplegar

Si `firebase deploy` falla:

1. Verifica que ejecutaste `npm run build` primero
2. Asegúrate de estar en la carpeta `mi-frontend`
3. Verifica que estés logueado: `firebase login`
4. Revisa que el proyecto esté configurado: `firebase use --add`

### La app no se conecta al backend

1. Verifica que el backend esté corriendo: `curl http://34.57.113.255:8000/health`
2. Verifica que el puerto 8000 esté abierto en el firewall de Google Cloud
3. Verifica la URL en `.env` y reconstruye: `npm run build`

### Problemas con el build

Si `npm run build` falla:

```bash
# Limpiar caché y reinstalar
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

## Monitoreo y Logs

### Frontend (Firebase)

Ver logs en la consola de Firebase:
- https://console.firebase.google.com/

### Backend (Google Cloud)

Conectarse al servidor por SSH:

```bash
gcloud compute ssh fastapi-server --zone=us-central1-a
```

Ver logs del backend:

```bash
# Ver logs en tiempo real
journalctl -u fastapi -f

# Ver últimas 100 líneas
journalctl -u fastapi -n 100
```

## Seguridad

### Recomendaciones

1. **Variables de entorno**: Nunca commitear `.env` con credenciales
2. **CORS**: En producción, especificar solo las URLs necesarias
3. **HTTPS**: El backend debería usar HTTPS en producción
4. **Firewall**: Solo abrir los puertos necesarios en Google Cloud
5. **Autenticación**: Implementar autenticación para endpoints sensibles

### Configuración del Firewall (Google Cloud)

Asegurarse de que estos puertos estén abiertos:

```bash
# Puerto 8000 para FastAPI
gcloud compute firewall-rules create allow-fastapi \
  --allow tcp:8000 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow FastAPI traffic"

# Puerto 22 para SSH
gcloud compute firewall-rules create allow-ssh \
  --allow tcp:22 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow SSH traffic"
```

## Próximos Pasos

- [ ] Implementar autenticación con Firebase Auth
- [ ] Agregar base de datos (Cloud SQL o Firestore)
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar HTTPS en el backend (Load Balancer o Nginx)
- [ ] Configurar dominio personalizado en Firebase
- [ ] Agregar monitoreo con Cloud Monitoring
- [ ] Implementar caché con Redis

## Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Google Cloud Compute Engine](https://cloud.google.com/compute/docs)

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
