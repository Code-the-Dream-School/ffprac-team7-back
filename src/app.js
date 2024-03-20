const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');

const mainRouter = require('./routes/mainRouter.js');
const userRouter = require("./routes/userRouter.js")
const itemsRouter = require('./routes/itemRouter.js');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use("/api/v1/users", userRouter)
app.use('/api/v1', mainRouter);
app.use('/api/v1/items', itemsRouter);

module.exports = app;