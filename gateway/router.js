function registerRoutes(app, routes) {
  routes.forEach(route => {
    const { method, path, response, status = 200 } = route;
    
    app[method.toLowerCase()](path, (req, res) => {
      res.status(status).json(response);
    });
    
    console.log(`✓ Registered ${method.toUpperCase()} ${path}`);
  });
}

module.exports = registerRoutes;
