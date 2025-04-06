const express = require('express');
const cors = require('cors');

// Rutas
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger'); // ← generado con swagger-jsdoc

const app = express();

app.use(cors());
app.use(express.json());

// Endpoints de la API
app.use('/api/users', userRoutes); 
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta base
app.get('/', (req, res) => res.send('🌟 UniTalent API Ready'));

module.exports = app;
