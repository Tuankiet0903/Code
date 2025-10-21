import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hello World",
      description: "A sample API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
};

const spec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
}

export default setupSwagger;
