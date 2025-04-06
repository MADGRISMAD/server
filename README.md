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

/server ├── src/ │ ├── routes/ # Rutas de la API │ ├── controllers/ # Lógica de negocio │ ├── models/ # Modelos de Mongoose │ ├── middlewares/ # Middlewares personalizados │ ├── docs/ # Configuración de Swagger │ └── app.js # Configuración principal de Express ├── index.js # Punto de entrada (conexión DB + servidor) ├── .env # Variables de entorno ├── .gitignore └── package.json

yaml
Copiar
Editar

---

## ⚙️ Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/uni-talent-backend.git
cd uni-talent-backend/server
2. Instala dependencias
bash
Copiar
Editar
npm install
3. Configura variables de entorno
Crea un archivo .env basado en .env.example:

ini
Copiar
Editar
MONGO_URI=mongodb://localhost:27017/unitalent
JWT_SECRET=supersecretkey
PORT=5000
▶️ Correr el servidor en modo desarrollo
bash
Copiar
Editar
npm run dev
Servidor en:

arduino
Copiar
Editar
http://localhost:5000
📚 Documentación Swagger
Una vez corras el servidor, accede a la documentación en:

bash
Copiar
Editar
http://localhost:5000/api/docs
✅ Funcionalidades MVP
Registro con email .edu (estudiantes)

Registro de empresas (sin restricción de email)

Inicio de sesión

Creación y búsqueda de ofertas laborales

Postulaciones

Centro de notificaciones

Panel de administración

Reporte de ofertas sospechosas

Validación de roles (student, employer, admin)

🛡️ Seguridad
Autenticación con JWT

Validación de roles por middleware

Protección de rutas por token

🧩 Contribuciones
¡Bienvenidas!
Solo asegúrate de seguir la estructura de carpetas y documentar tus endpoints si agregas nuevos.

📬 Contacto
Para dudas o propuestas:
Madeline Sabino – madgrismad@gmail.com

🧠 Licencia
MIT – puedes modificar, usar o distribuir este proyecto con fines personales o comerciales.