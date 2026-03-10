function validateRequest(req, res, next) {
  // Validate JSON for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (req.headers['content-type'] !== 'application/json') {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json'
      });
    }
  }
  next();
}

module.exports = validateRequest;
