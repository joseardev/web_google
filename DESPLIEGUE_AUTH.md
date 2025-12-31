# Guía de Despliegue - Sistema de Autenticación

## ¡Sistema de Autenticación Completo Implementado! 🎉

### Lo que se ha implementado:

#### Backend FastAPI
- ✅ Autenticación JWT completa
- ✅ Endpoints de login y registro
- ✅ Perfiles de usuario con roles (admin/user)
- ✅ Actualización de perfil
- ✅ Hash seguro de contraseñas con bcrypt
- ✅ Rutas protegidas con tokens

#### Frontend React
- ✅ Formulario de Login
- ✅ Formulario de Registro
- ✅ Página de Perfil de usuario
- ✅ Context API para gestión de autenticación
- ✅ Rutas protegidas
- ✅ LocalStorage para persistencia de sesión
- ✅ Diseño moderno y responsive

---

## Pasos para Desplegar

### 1. Desplegar Backend a Cloud Run

```bash
# Desde tu terminal (PowerShell o CMD)
cd C:\Users\jalon\Documents\python\google_cloud\backend_inicial

# Desplegar a Cloud Run
gcloud run deploy mi-fastapi-backend \
  --source . \
  --region=europe-west1 \
  --allow-unauthenticated \
  --set-env-vars SECRET_KEY=tu-clave-secreta-super-segura-para-jwt

# O en Windows PowerShell:
gcloud run deploy mi-fastapi-backend --source . --region=europe-west1 --allow-unauthenticated --set-env-vars SECRET_KEY=tu-clave-secreta-super-segura-para-jwt
```

**Importante**: La URL del backend debería ser la misma:
```
https://mi-fastapi-backend-220000789664.europe-west1.run.app
```

### 2. Verificar que el Backend Funciona

Una vez desplegado, prueba estos endpoints:

```bash
# Health check
curl https://mi-fastapi-backend-220000789664.europe-west1.run.app/health

# Ver documentación interactiva
# Abre en tu navegador:
https://mi-fastapi-backend-220000789664.europe-west1.run.app/docs
```

### 3. Desplegar Frontend a Firebase

```bash
cd C:\Users\jalon\Documents\python\google_cloud\web_google\mi-frontend

# Reconstruir (ya está hecho)
npm run build

# Desplegar
firebase deploy
```

---

## Endpoints del Backend

### Autenticación

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/token` | Login OAuth2 (Swagger) | No |

### Usuarios

| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Obtener perfil actual | Sí |
| PUT | `/api/users/me` | Actualizar perfil | Sí |
| POST | `/api/users/me/change-password` | Cambiar contraseña | Sí |
| GET | `/api/users/{user_id}` | Obtener usuario por ID | Sí |

---

## Cómo Usar la Aplicación

### 1. Registro de Usuario

1. Abre la app: `https://pruebas-19cc6.web.app`
2. Verás el formulario de Login
3. Click en "Regístrate aquí"
4. Completa el formulario:
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
   - Nombre completo (opcional)
5. Click en "Registrarse"
6. Serás redirigido automáticamente al perfil

### 2. Iniciar Sesión

1. Ve a `https://pruebas-19cc6.web.app/login`
2. Ingresa email y contraseña
3. Click en "Iniciar Sesión"
4. Serás redirigido al perfil

### 3. Ver y Editar Perfil

1. Una vez logueado, estarás en `/profile`
2. Verás tu información:
   - ID de usuario
   - Email
   - Nombre completo
   - Rol (user o admin)
   - Fecha de registro
3. Click en "Editar Perfil" para modificar datos
4. Guarda los cambios
5. Click en "Cerrar Sesión" para salir

---

## Flujo de Autenticación

```
1. Usuario se registra/inicia sesión
   ↓
2. Backend genera JWT token
   ↓
3. Frontend guarda token en localStorage
   ↓
4. En cada petición a rutas protegidas:
   - Frontend envía: Authorization: Bearer {token}
   - Backend verifica el token
   - Si es válido, permite acceso
   - Si no, retorna 401 Unauthorized
   ↓
5. Frontend redirige a /login si no está autenticado
```

---

## Estructura de Archivos Nuevos

### Backend

```
backend_inicial/
├── app/
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py              # Lógica JWT
│   │   └── password.py         # Hash de contraseñas
│   ├── routers/
│   │   ├── auth.py             # Login/Register
│   │   └── users.py            # Perfil de usuario
│   ├── schemas/
│   │   └── user.py             # Schemas Pydantic
│   └── models/
│       └── models.py           # Modelo User actualizado
├── requirements.txt            # Con nuevas dependencias
└── main.py                     # Con routers incluidos
```

### Frontend

```
mi-frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.js      # Context de autenticación
│   ├── components/
│   │   ├── Login.js            # Formulario login
│   │   ├── Register.js         # Formulario registro
│   │   ├── Profile.js          # Página de perfil
│   │   ├── PrivateRoute.js     # Protección de rutas
│   │   └── Auth.css            # Estilos
│   └── App.js                  # Con rutas configuradas
└── package.json                # Con react-router-dom
```

---

## Probar en Local

### Backend

```bash
cd backend_inicial

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar
uvicorn main:app --reload --port 8080
```

El backend estará en: `http://localhost:8080`

Documentación interactiva: `http://localhost:8080/docs`

### Frontend

```bash
cd mi-frontend

# Ejecutar en desarrollo
npm start
```

El frontend estará en: `http://localhost:3000`

---

## Crear Usuario Admin Manualmente

Para crear un usuario con rol admin, puedes:

1. Registrarte normalmente
2. Conectarte a la base de datos SQLite:

```bash
cd backend_inicial
sqlite3 sql_app.db

# Cambiar rol a admin
UPDATE users SET role = 'admin' WHERE email = 'tu@email.com';
.quit
```

O usar la documentación de Swagger en `/docs`

---

## Seguridad - Variables de Entorno

Para producción, configura estas variables de entorno en Cloud Run:

```bash
SECRET_KEY=tu-clave-secreta-muy-segura-y-larga
DATABASE_URL=postgresql://user:pass@host/db  # Si usas PostgreSQL
```

Para configurarlas en Cloud Run:

```bash
gcloud run services update mi-fastapi-backend \
  --region=europe-west1 \
  --set-env-vars SECRET_KEY=tu-clave-super-secreta
```

---

## Solución de Problemas

### Error: "No se pudo validar las credenciales"

- Verifica que el token no haya expirado
- Cierra sesión y vuelve a iniciar sesión
- Limpia localStorage del navegador

### Error: "El email ya está registrado"

- Usa otro email
- O elimina el usuario de la base de datos

### Error de CORS

- Verifica que CORS esté configurado en `main.py`
- Redespliega el backend

### La app no guarda la sesión

- Verifica que localStorage esté habilitado en tu navegador
- Revisa la consola del navegador para errores

---

## Próximas Mejoras

- [ ] Recuperación de contraseña por email
- [ ] Verificación de email
- [ ] Refresh tokens
- [ ] OAuth2 (Google, GitHub)
- [ ] Panel de administración
- [ ] Migrar a PostgreSQL en Cloud SQL
- [ ] Rate limiting
- [ ] Logs de auditoría

---

## URLs del Proyecto

- **Frontend**: https://pruebas-19cc6.web.app
- **Backend**: https://mi-fastapi-backend-220000789664.europe-west1.run.app
- **API Docs**: https://mi-fastapi-backend-220000789664.europe-west1.run.app/docs
- **Repositorio**: https://github.com/joseardev/web_google

---

¡Tu sistema de autenticación está listo para producción! 🚀
