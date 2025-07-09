const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Role-Based API with TronGrid',
      version: '1.0.0',
      description: 'A secure role-based API for Admin, Merchant, and Users with TronGrid integration',
    },
    servers: [{ url: 'https://onlinetxmanag.onrender.com' }],
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'merchant', 'admin'] },
          },
        },
        Merchant: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            users: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            sender: { type: 'string' },
            receiver: { type: 'string' },
            amount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
            txId: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
