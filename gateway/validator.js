const { resolveStatus } = require('./statusCodes');

function validateRequest(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const ct = req.headers['content-type'] || '';
    if (!ct.includes('application/json')) {
      const { message } = resolveStatus(415);
      return res.status(415).json({ status: 415, message, error: 'Content-Type must be application/json' });
    }
    if (req.body && typeof req.body !== 'object') {
      const { message } = resolveStatus(400);
      return res.status(400).json({ status: 400, message, error: 'Invalid JSON body' });
    }
  }
  next();
}

module.exports = validateRequest;
