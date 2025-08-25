const express = require('express');

const errorHandler = require('./utils/errorHandler');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);


module.exports = app;