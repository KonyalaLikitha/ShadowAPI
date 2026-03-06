function errorHandler(err, req, res, next) {
  console.error(`🔴 Error: ${err.message}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`
  });
}

module.exports = { errorHandler, notFoundHandler };
