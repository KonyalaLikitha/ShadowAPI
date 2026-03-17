const http = require('http');
const https = require('https');
const { URL } = require('url');

const TIMEOUT_MS = 3000;

/**
 * Probe backendUrl with a HEAD request.
 * Resolves to { reachable: bool, latency: number|null, statusCode: number|null }
 */
function checkBackend(backendUrl) {
  return new Promise((resolve) => {
    let target;
    try {
      target = new URL(backendUrl);
    } catch {
      return resolve({ reachable: false, latency: null, statusCode: null, error: 'invalid URL' });
    }

    const transport = target.protocol === 'https:' ? https : http;
    const start = Date.now();
    let done = false;

    const finish = (result) => {
      if (!done) {
        done = true;
        resolve(result);
      }
    };

    const req = transport.request(
      {
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: target.pathname || '/',
        method: 'HEAD',
        timeout: TIMEOUT_MS,
      },
      (res) => {
        res.resume();
        finish({ reachable: true, latency: Date.now() - start, statusCode: res.statusCode });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      finish({ reachable: false, latency: null, statusCode: null, error: 'timeout' });
    });

    req.on('error', (err) => {
      finish({ reachable: false, latency: null, statusCode: null, error: err.message });
    });

    req.end();
  });
}

module.exports = checkBackend;
