const express = require('express');
const fs = require('fs');
const path = require('path');
const setupMiddleware = require('./middleware');
const registerRoutes = require('./router');
const routes = require('./routes.config');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const createProxyMiddleware = require('./proxy');
const checkBackend = require('./backendChecker');

const app = express();
const PORT = process.env.PORT || 3000;

function loadConfig() {
  const configPath = path.join(process.cwd(), 'shadowapi.config.json');
  if (!fs.existsSync(configPath)) return { mode: 'mock', backend: null };
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return { mode: 'mock', backend: null };
  }
}

const config = loadConfig();
const mode = process.env.SHADOW_MODE || config.mode || 'mock';
const backendUrl = process.env.BACKEND_URL || config.backend || null;

let backendHealth = { reachable: null, latency: null, statusCode: null, checkedAt: null };

async function probeBackend() {
  if (!backendUrl) return;
  const result = await checkBackend(backendUrl);
  backendHealth = { ...result, checkedAt: new Date().toISOString() };
  const tag = result.reachable
    ? `\x1b[32mreachable\x1b[0m (${result.latency}ms)`
    : `\x1b[31munreachable\x1b[0m (${result.error})`;
  console.log(`\x1b[36m[gateway]\x1b[0m backend ${backendUrl} → ${tag}`);
}

setupMiddleware(app);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShadowAPI Gateway', mode, backend: backendUrl || 'none' });
});

app.get('/gateway/status', async (req, res) => {
  if (backendUrl) {
    const result = await checkBackend(backendUrl);
    backendHealth = { ...result, checkedAt: new Date().toISOString() };
  }
  res.json({
    mode,
    backend: backendUrl || null,
    backendHealth: backendUrl ? backendHealth : null,
    mockRoutes: routes.length,
    uptime: Math.floor(process.uptime()),
  });
});

// Proxy layer — pass mode + routes so proxy can tag headers and validate responses
if ((mode === 'proxy' || mode === 'hybrid') && backendUrl) {
  console.log(`\x1b[36m[gateway]\x1b[0m Proxy enabled → ${backendUrl}`);
  app.use(createProxyMiddleware(backendUrl, mode, routes));
}

registerRoutes(app, routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`\x1b[32m🚀 ShadowAPI Gateway\x1b[0m running on http://localhost:${PORT} \x1b[2m[${mode}]\x1b[0m`);
  await probeBackend();
});
