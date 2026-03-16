const STATUS = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

function resolveStatus(code) {
  return {
    code,
    message: STATUS[code] || 'Unknown Status',
  };
}

function sendStatus(res, code, body = null) {
  const { message } = resolveStatus(code);
  res.status(code).json({
    status: code,
    message,
    ...(body !== null && { data: body }),
  });
}

module.exports = { resolveStatus, sendStatus, STATUS };
