module.exports = {
  startServer: require('./server').startServer,
  logger: require('./logger'),
  statusCodes: require('./statusCodes'),
  registerRoutes: require('./router'),
  setupMiddleware: require('./middleware'),
};
