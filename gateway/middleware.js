const express = require('express');
const requestLogger = require('./logger');
const validateRequest = require('./validator');

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
};

const modeTag = (req, res, next) => {
  res.locals.source = 'mock'; // proxy will override to 'real' if forwarded
  req.shadowapi = { params: req.params, query: req.query, timestamp: Date.now() };
  next();
};

function setupMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(corsMiddleware);
  app.use(modeTag);
  app.use(requestLogger);
  app.use(validateRequest);
}

module.exports = setupMiddleware;
