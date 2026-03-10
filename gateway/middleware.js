const express = require('express');
const requestLogger = require('./logger');
const validateRequest = require('./validator');

function setupMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(validateRequest);
  
  // CORS support
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
}

module.exports = setupMiddleware;
