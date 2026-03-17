const http = require('http');
const https = require('https');
const { URL } = require('url');

const PROXY_TIMEOUT_MS = 10000;

function forwardRequest(backendUrl, req, res, next) {
  let target;
  try {
    target = new URL(req.originalUrl, backendUrl);
  } catch {
    return next();
  }

  const isHttps = target.protocol === 'https:';
  const transport = isHttps ? https : http;

  const headers = { ...req.headers, host: target.hostname, 'x-forwarded-by': 'shadowapi' };
  // remove content-length so we don't lie about body size after header stripping
  delete headers['content-length'];

  const options = {
    hostname: target.hostname,
    port: target.port || (isHttps ? 443 : 80),
    path: target.pathname + target.search,
    method: req.method,
    headers,
    timeout: PROXY_TIMEOUT_MS,
  };

  const proxyReq = transport.request(options, (proxyRes) => {
    res.locals.source = 'real';
    res.setHeader('x-shadowapi-source', 'real');
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    console.warn('\x1b[33m[proxy]\x1b[0m backend timed out, falling back to mock');
    next();
  });

  proxyReq.on('error', (err) => {
    console.warn(`\x1b[33m[proxy]\x1b[0m backend unreachable (${err.message}), falling back to mock`);
    next();
  });

  // stream raw request body directly — avoids double-parse issues with express.json()
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req.pipe(proxyReq, { end: true });
  } else {
    proxyReq.end();
  }
}

function createProxyMiddleware(backendUrl) {
  return (req, res, next) => forwardRequest(backendUrl, req, res, next);
}

module.exports = createProxyMiddleware;
