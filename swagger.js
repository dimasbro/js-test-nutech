const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const APP_URL = process.env.APP_URL;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Contract SIMS PPOB',
            version: '1.0.0',
            description: 'API documentation for user login and transaction',
        },
        servers: [
            {
                url: `${APP_URL}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Optional
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };