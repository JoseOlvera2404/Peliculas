const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
  apis: ['./src/routes/*.js'] // aquí leerá los comentarios
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };