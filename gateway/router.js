const { sendStatus } = require('./statusCodes');
const { handleMockRequest } = require('../engine');

function registerRoutes(app, routes, mode) {
  routes.forEach(route => {
    const { method, path } = route;

    app[method.toLowerCase()](path, (req, res) => {
      res.setHeader('x-shadowapi-source', 'mock');
      res.setHeader('x-shadowapi-mode', mode || 'mock');

      const result = handleMockRequest(req);

      if (!result) {
        return res.status(502).json({ error: 'No mock available' });
      }

      if (result.status === 204 || result.body === null) {
        return res.status(result.status || 204).end();
      }

      sendStatus(res, result.status, result.body);
    });

    console.log(`\x1b[32m✓\x1b[0m Registered ${method.toUpperCase()} ${path}`);
  });
}

module.exports = registerRoutes;
