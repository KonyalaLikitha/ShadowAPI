const statusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

function errorHandler(err, req, res, next) {
  const status = err.status || statusCodes.INTERNAL_SERVER_ERROR;
  console.error(`🔴 Error [${status}]: ${err.message}`);
  
  res.status(status).json({
    error: err.name || 'Internal Server Error',
    message: err.message,
    status
  });
}

function notFoundHandler(req, res) {
  res.status(statusCodes.NOT_FOUND).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    status: statusCodes.NOT_FOUND
  });
}

module.exports = { errorHandler, notFoundHandler, statusCodes };
