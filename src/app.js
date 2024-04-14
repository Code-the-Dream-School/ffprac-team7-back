const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");


// swagger documentation
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Express API for StuffFindr",
        version: "1.0.0",
        description: "This is a REST API app created with Express."
    },
    servers: [
        {   url: "http://localhost:8000",
            description: "Development server",
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// swagger Ui page
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routers
const mainRouter = require("./routes/mainRouter.js");
const userRouter = require("./routes/userRouter.js");
const itemsRouter = require("./routes/itemRouter.js");

const errorHandlerMiddleware = require("./middleware/errorHandler.js");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

// user authentication
const authenticateUser = require("./middleware/authentication.js");

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1", mainRouter);
app.use("/api/v1/items", authenticateUser, itemsRouter);

// error handler middleware
app.use(errorHandlerMiddleware);

module.exports = app;
