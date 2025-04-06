const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniTalent API',
      version: '1.0.0',
      description: 'Documentación del backend para UniTalent',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor local',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'] // Comentarios @swagger se leerán desde las rutas
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
