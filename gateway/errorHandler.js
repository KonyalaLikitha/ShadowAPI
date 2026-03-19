const { resolveStatus } = require('./statusCodes');

function errorHandler(err, req, res, _next) {
  const code = err.status || 500;
  const { message } = resolveStatus(code);
  console.error(`\x1b[31m[error]\x1b[0m ${code} — ${err.message}`);
  res.status(code).json({ status: code, message, error: err.message });
}

function notFoundHandler(req, res) {
  const code = 404;
  const { message } = resolveStatus(code);
  res.setHeader('x-shadowapi-source', 'mock');
  res.status(code).json({
    status: code,
    message,
    error: `Route ${req.method} ${req.path} does not exist`,
  });
}

module.exports = { errorHandler, notFoundHandler };
