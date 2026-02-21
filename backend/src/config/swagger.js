const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const serverUrl = process.env.RAILWAY_SERVICE_DOMAIN
  ? `https://${process.env.RAILWAY_SERVICE_DOMAIN}`
  : `http://localhost:${process.env.PORT || 3000}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Películas',
      version: '1.0.0',
      description: 'Documentación de la API del proyecto escolar'
    },
    servers: [
      {
        url: serverUrl
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
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };