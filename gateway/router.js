function registerRoutes(app, routes) {
  routes.forEach(route => {
    const { method, path, response, status = 200 } = route;
    
    app[method.toLowerCase()](path, (req, res) => {
      // Inject params into response if present
      const responseData = typeof response === 'function' 
        ? response(req.params, req.body) 
        : { ...response, params: req.params };
      
      res.status(status).json(responseData);
    });
    
    console.log(`✓ Registered ${method.toUpperCase()} ${path}`);
  });
}

module.exports = registerRoutes;
