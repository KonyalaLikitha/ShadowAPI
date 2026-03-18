const http = require('http');
const https = require('https');
const { URL } = require('url');
const validateResponse = require('./responseValidator');

const PROXY_TIMEOUT_MS = 10000;
const MAX_RETRIES = 1;

function buildOptions(target, req, isHttps) {
  const headers = { ...req.headers, host: target.hostname, 'x-forwarded-by': 'shadowapi' };
  delete headers['content-length'];
  return {
    hostname: target.hostname,
    port: target.port || (isHttps ? 443 : 80),
    path: target.pathname + target.search,
    method: req.method,
    headers,
    timeout: PROXY_TIMEOUT_MS,
  };
}

function attemptForward(target, req, res, mode, routes, retries, fallback) {
  const isHttps = target.protocol === 'https:';
  const transport = isHttps ? https : http;
  const options = buildOptions(target, req, isHttps);

  const proxyReq = transport.request(options, (proxyRes) => {
    res.locals.source = 'real';
    res.setHeader('x-shadowapi-source', 'real');
    res.setHeader('x-shadowapi-mode', mode);

    // collect body for validation on GET requests
    if (req.method === 'GET') {
      const chunks = [];
      proxyRes.on('data', chunk => chunks.push(chunk));
      proxyRes.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        try {
          const body = JSON.parse(raw);
          validateResponse(target.pathname, routes, body);
        } catch { /* non-JSON body — skip validation */ }

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(raw);
      });
    } else {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (retries > 0) {
      console.warn(`\x1b[33m[proxy]\x1b[0m timeout — retrying (${retries} left)`);
      attemptForward(target, req, res, mode, routes, retries - 1, fallback);
    } else {
      console.warn('\x1b[33m[proxy]\x1b[0m backend timed out, falling back to mock');
      fallback();
    }
  });

  proxyReq.on('error', (err) => {
    if (retries > 0) {
      console.warn(`\x1b[33m[proxy]\x1b[0m error (${err.message}) — retrying (${retries} left)`);
      attemptForward(target, req, res, mode, routes, retries - 1, fallback);
    } else {
      console.warn(`\x1b[33m[proxy]\x1b[0m backend unreachable (${err.message}), falling back to mock`);
      fallback();
    }
  });

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    req.pipe(proxyReq, { end: true });
  } else {
    proxyReq.end();
  }
}

function forwardRequest(backendUrl, req, res, next, mode, routes) {
  let target;
  try {
    target = new URL(req.originalUrl, backendUrl);
  } catch {
    return next();
  }
  attemptForward(target, req, res, mode, routes, MAX_RETRIES, next);
}

function createProxyMiddleware(backendUrl, mode, routes) {
  return (req, res, next) => forwardRequest(backendUrl, req, res, next, mode, routes);
}

module.exports = createProxyMiddleware;
