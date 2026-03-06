const express = require('express');
const setupMiddleware = require('./middleware');
const registerRoutes = require('./router');
const routes = require('./routes.config');
const app = express();
const PORT = process.env.PORT || 3000;

setupMiddleware(app);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShadowAPI Gateway' });
});

// Auto-register routes
registerRoutes(app, routes);

app.listen(PORT, () => {
  console.log(`🚀 ShadowAPI Gateway running on http://localhost:${PORT}`);
});
