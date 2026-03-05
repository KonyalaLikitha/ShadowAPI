const express = require('express');
const requestLogger = require('./logger');
const registerRoutes = require('./router');
const routes = require('./routes.config');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShadowAPI Gateway' });
});

// Auto-register routes
registerRoutes(app, routes);

app.listen(PORT, () => {
  console.log(`🚀 ShadowAPI Gateway running on http://localhost:${PORT}`);
});
