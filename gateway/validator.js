const { resolveStatus } = require('./statusCodes');

function validateRequest(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const ct = req.headers['content-type'] || '';
    if (!ct.includes('application/json')) {
      const { message } = resolveStatus(415);
      return res.status(415).json({
        status: 415,
        message,
        error: `Content-Type must be application/json, got: ${ct || 'none'}`
      });
    }
    if (req.body && typeof req.body !== 'object') {
      const { message } = resolveStatus(400);
      return res.status(400).json({ status: 400, message, error: 'Invalid JSON body' });
    }
    if (req.body && Array.isArray(req.body)) {
      const { message } = resolveStatus(400);
      return res.status(400).json({ status: 400, message, error: 'Body must be a JSON object, not an array' });
    }
  }
  next();
}

module.exports = validateRequest;
