const { sendStatus } = require('./statusCodes');

function registerRoutes(app, routes, mode) {
  routes.forEach(route => {
    const { method, path, response, status = 200 } = route;

    app[method.toLowerCase()](path, (req, res) => {
      res.setHeader('x-shadowapi-source', 'mock');
      res.setHeader('x-shadowapi-mode', mode || process.env.SHADOW_MODE || 'mock');

      if (status === 204) return res.status(204).end();

      const data =
        typeof response === 'function'
          ? response(req.params, req.body, req.query)
          : path.includes(':')
          ? resolveParams(response, req.params)
          : response;

      sendStatus(res, status, data);
    });

    console.log(`\x1b[32m✓\x1b[0m Registered ${method.toUpperCase()} ${path}`);
  });
}

function resolveParams(response, params) {
  const data = { ...response };
  Object.keys(params).forEach(k => { if (data[k] !== undefined) data[k] = params[k]; });
  return data;
}

module.exports = registerRoutes;
