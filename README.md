# 🎓 UniTalent – Plataforma para oportunidades universitarias

UniTalent es una plataforma que conecta a estudiantes universitarios con oportunidades laborales como freelance, remoto o por proyecto, permitiendo a empresas encontrar talento joven y entusiasta.

---

## 🚀 Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: MongoDB
- **Autenticación**: JWT
- **Documentación**: Swagger (OpenAPI 3.x)
- **ORM**: Mongoose

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

## ✅ Funcionalidades MVP

- Registro con email `.edu` (estudiantes)
- Registro de empresas (sin restricción de email)
- Inicio de sesión
- Creación y búsqueda de ofertas laborales
- Postulaciones
- Centro de notificaciones
- Panel de administración
- Reporte de ofertas sospechosas
- Validación de roles (`student`, `employer`, `admin`)

---

## 🛡️ Seguridad

- Autenticación con JWT
- Validación de roles por middleware
- Protección de rutas por token

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

