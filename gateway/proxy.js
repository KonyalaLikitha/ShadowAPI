const http = require('http');
const https = require('https');
const { URL } = require('url');

function forwardRequest(backendUrl, req, res, next) {
  let target;
  try {
    target = new URL(req.originalUrl, backendUrl);
  } catch {
    return next();
  }

  const isHttps = target.protocol === 'https:';
  const transport = isHttps ? https : http;

  const options = {
    hostname: target.hostname,
    port: target.port || (isHttps ? 443 : 80),
    path: target.pathname + target.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: target.hostname,
      'x-forwarded-by': 'shadowapi',
    },
  };

  const proxyReq = transport.request(options, (proxyRes) => {
    res.locals.source = 'real';
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`\x1b[33m[proxy]\x1b[0m backend unreachable (${err.message}), falling back to mock`);
    next();
  });

  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }

  proxyReq.end();
}

function createProxyMiddleware(backendUrl) {
  return (req, res, next) => forwardRequest(backendUrl, req, res, next);
}

module.exports = createProxyMiddleware;
