module.exports = {
  createServer: () => require('./server'),
  logger: require('./logger'),
  statusCodes: require('./statusCodes'),
  registerRoutes: require('./router'),
  setupMiddleware: require('./middleware'),
};
