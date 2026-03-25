const { resolveStatus } = require('./statusCodes');

function errorHandler(err, req, res, _next) {
  // handle malformed JSON body sent by client
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 400, message: 'Bad Request', error: 'Malformed JSON body' });
  }

  // handle payload too large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ status: 413, message: 'Payload Too Large', error: 'Request body exceeds limit' });
  }

  const code = err.status || 500;
  const { message } = resolveStatus(code);
  console.error(`\x1b[31m[error]\x1b[0m ${code} — ${err.message}`);
  res.status(code).json({ status: code, message, error: err.message });
}

function notFoundHandler(req, res) {
  const code = 404;
  const { message } = resolveStatus(code);
  res.setHeader('x-shadowapi-source', 'mock');
  res.setHeader('x-shadowapi-mode', res.locals.mode || 'mock');
  res.status(code).json({
    status: code,
    message,
    error: `Route ${req.method} ${req.path} does not exist`,
  });
}

module.exports = { errorHandler, notFoundHandler };
