const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routing middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShadowAPI Gateway' });
});

app.listen(PORT, () => {
  console.log(`🚀 ShadowAPI Gateway running on http://localhost:${PORT}`);
});
