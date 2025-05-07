# 🎓 UniTalent – Plataforma para oportunidades universitarias

UniTalent es una plataforma que conecta a estudiantes universitarios con oportunidades laborales como freelance, remoto o por proyecto, permitiendo a empresas encontrar talento joven y entusiasta.

---

## 🚀 Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: MongoDB
- **Autenticación**: JWT
- **Documentación**: Swagger (OpenAPI 3.x)
- **ORM**: Mongoose
- **Monitoreo**: Sentry
- **Almacenamiento**: Cloudinary
- **Comunicación en tiempo real**: Socket.IO

---

## 📁 Estructura del proyecto

```
/server
  ├── src/
  │   ├── config/            # Conexión a base de datos y configuración
  │   ├── controllers/       # Lógica de negocio
  │   ├── docs/              # Configuración de Swagger (OpenAPI)
  │   ├── middlewares/       # Middlewares personalizados (auth, roles, etc.)
  │   ├── models/            # Modelos Mongoose
  │   ├── routes/            # Definición de rutas API
  │   ├── services/          # Servicios auxiliares (email, pagos, etc.)
  │   ├── utils/             # Funciones reutilizables o helpers
  │   └── app.js             # Configuración principal de Express
  ├── .env                   # Variables de entorno (no subir a git)
  ├── .gitignore
  ├── index.js               # Entry point (conexión DB + server)
  ├── package.json
  ├── package-lock.json
  └── README.md
```

---

## ⚙️ Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/uni-talent-backend.git
cd uni-talent-backend/server
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```
MONGO_URI=mongodb://localhost:27017/unitalent
JWT_SECRET=supersecretkey
PORT=5000
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
SENTRY_DSN=tu_sentry_dsn
CLIENT_URL=http://localhost:3000
```

---

## ▶️ Correr el servidor en modo desarrollo

```bash
npm run dev
```

Servidor en:

```
http://localhost:5000
```

---

## 📚 Documentación Swagger

Una vez corras el servidor, accede a la documentación en:

```
http://localhost:5000/api/docs
```

---

## ✅ Funcionalidades Implementadas

### Sistema de Usuarios
- Registro con email `.edu` (estudiantes)
- Registro de empresas (sin restricción de email)
- Inicio de sesión
- Validación de roles (`student`, `employer`, `admin`)
- Perfiles profesionales con portafolio
- Generación de CV en PDF

### Sistema de Trabajos
- Creación y búsqueda de ofertas laborales
- Postulaciones
- Sistema de pujas con puntos
- Ranking de postulantes
- Reporte de ofertas sospechosas

### Sistema de Puntos y Reseñas
- Reseñas por trabajo completado
- Calificaciones universitarias
- Calificaciones de carrera
- Sistema de puntos ganados
- Subastas con puntos
- Historial de transacciones

### Comunicación
- Centro de notificaciones en tiempo real
- Sistema de mensajería
- Notificaciones por email

### Administración
- Panel de administración
- Gestión de usuarios
- Gestión de ofertas
- Reportes y estadísticas

### Seguridad
- Autenticación con JWT
- Validación de roles por middleware
- Protección de rutas por token
- Manejo de errores centralizado
- Monitoreo con Sentry

---

## 🛡️ Seguridad

- Autenticación con JWT
- Validación de roles por middleware
- Protección de rutas por token
- Manejo de errores centralizado
- Monitoreo con Sentry
- Validación de datos
- Sanitización de inputs

---

## 🥉 Contribuciones

¡Bienvenidas!  
Solo asegúrate de seguir la estructura de carpetas y documentar tus endpoints si agregas nuevos.

---

## 📬 Contacto

Para dudas o propuestas:  
**Madeline Sabino** – [madgrismad@gmail.com](mailto:madgrismad@gmail.com)

---

## 🧠 Licencia

MIT – puedes modificar, usar o distribuir este proyecto con fines personales o comerciales.

