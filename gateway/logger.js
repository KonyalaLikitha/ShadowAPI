const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
};

function colorStatus(code) {
  if (code >= 500) return COLORS.red;
  if (code >= 400) return COLORS.yellow;
  if (code >= 300) return COLORS.cyan;
  return COLORS.green;
}

function colorMethod(method) {
  const map = {
    GET: COLORS.green,
    POST: COLORS.blue,
    PUT: COLORS.yellow,
    PATCH: COLORS.magenta,
    DELETE: COLORS.red,
  };
  return map[method] || COLORS.reset;
}

function formatLog({ method, url, status, duration, source }) {
  const ts = new Date().toISOString();
  const col = colorStatus(status);
  const mCol = colorMethod(method);
  const src = source === 'mock' ? `${COLORS.magenta}[mock]` : `${COLORS.cyan}[real]`;
  return (
    `${COLORS.dim}${ts}${COLORS.reset} ` +
    `${mCol}${method.padEnd(7)}${COLORS.reset} ` +
    `${url.padEnd(35)} ` +
    `${col}${status}${COLORS.reset} ` +
    `${src}${COLORS.reset} ` +
    `${COLORS.dim}${duration}ms${COLORS.reset}`
  );
}

function logger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const source = res.locals.source || 'mock';
    console.log(
      formatLog({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        source,
      })
    );
  });

  next();
}

module.exports = logger;
