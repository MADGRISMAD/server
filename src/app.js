const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { globalErrorHandler } = require('./utils/errorHandler');
const Sentry = require('@sentry/node');

// Rutas
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const messageRoutes = require('./routes/message.routes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger'); // ← generado con swagger-jsdoc

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Inicializar Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

// Middleware de Sentry
app.use(Sentry.Handlers.requestHandler());

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Usuario ${userId} se unió a su sala de notificaciones`);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Make io accessible to our router
app.set('io', io);

// Endpoints de la API
app.use('/api/users', userRoutes); 
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/messages', messageRoutes);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta base
app.get('/', (req, res) => res.send('🌟 UniTalent API Ready'));

// Middleware de Sentry para errores
app.use(Sentry.Handlers.errorHandler());

// Manejador global de errores
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
