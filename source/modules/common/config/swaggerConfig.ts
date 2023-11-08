import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crawler Api',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./source/modules/web/crawler/crawler.routes.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
