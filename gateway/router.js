function registerRoutes(app, routes) {
  routes.forEach(route => {
    const { method, path, response, status = 200 } = route;
    
    app[method.toLowerCase()](path, (req, res) => {
      let responseData;
      
      if (typeof response === 'function') {
        responseData = response(req.params, req.body, req.query);
      } else if (path.includes(':')) {
        responseData = { ...response };
        Object.keys(req.params).forEach(key => {
          if (responseData[key] !== undefined) {
            responseData[key] = req.params[key];
          }
        });
      } else {
        responseData = response;
      }
      
      res.status(status).json(responseData);
    });
    
    console.log(`✓ Registered ${method.toUpperCase()} ${path}`);
  });
}

module.exports = registerRoutes;
