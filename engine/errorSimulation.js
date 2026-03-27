function simulateError(method = 'GET') {
  if (process.env.NODE_ENV === 'test') return null;

  const random = Math.random();

  if (random < 0.05) {
    return { status: 500, response: { success: false, error: 'Internal server error' } };
  }

  if (random < 0.08 && method === 'GET') {
    return { status: 429, response: { success: false, error: 'Too many requests' } };
  }

  if (random < 0.10 && ['POST', 'PUT'].includes(method)) {
    return { status: 400, response: { success: false, error: 'Bad request' } };
  }

  if (random < 0.11) {
    return { status: 503, response: { success: false, error: 'Service temporarily unavailable' } };
  }

  return null;
}

module.exports = { simulateError };
