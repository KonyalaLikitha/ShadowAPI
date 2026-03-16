const express = require('express');
const fs = require('fs');
const path = require('path');
const setupMiddleware = require('./middleware');
const registerRoutes = require('./router');
const routes = require('./routes.config');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const createProxyMiddleware = require('./proxy');

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

setupMiddleware(app);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShadowAPI Gateway', mode, backend: backendUrl || 'none' });
});

// Proxy layer — active in proxy or hybrid mode
if ((mode === 'proxy' || mode === 'hybrid') && backendUrl) {
  console.log(`\x1b[36m[gateway]\x1b[0m Proxy enabled → ${backendUrl}`);
  app.use(createProxyMiddleware(backendUrl));
}

// Mock routes — always registered; in proxy mode they act as fallback
registerRoutes(app, routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\x1b[32m🚀 ShadowAPI Gateway\x1b[0m running on http://localhost:${PORT} \x1b[2m[${mode}]\x1b[0m`);
});
