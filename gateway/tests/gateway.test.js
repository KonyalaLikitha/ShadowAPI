const express = require('express');
const http = require('http');
const request = require('supertest');
const setupMiddleware = require('../middleware');
const registerRoutes = require('../router');
const routes = require('../routes.config');
const { errorHandler, notFoundHandler } = require('../errorHandler');
const createProxyMiddleware = require('../proxy');

function buildApp(mode = 'mock', backendUrl = null) {
  const app = express();
  setupMiddleware(app);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ShadowAPI Gateway', mode, backend: backendUrl || 'none' });
  });

  if ((mode === 'proxy' || mode === 'hybrid') && backendUrl) {
    app.use(createProxyMiddleware(backendUrl, mode, routes));
  }

  registerRoutes(app, routes, mode);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

// ── Mock mode ────────────────────────────────────────────────────────────────

describe('Mock mode — routes', () => {
  const app = buildApp('mock');

  test('GET /api/users returns user list', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  test('GET /api/users/:id returns single user', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  test('POST /api/users returns 201', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({ name: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
  });

  test('PUT /api/users/:id returns 200', async () => {
    const res = await request(app)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send({ name: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  test('DELETE /api/users/:id returns 204', async () => {
    const res = await request(app).delete('/api/users/1');
    expect(res.status).toBe(204);
  });

  test('GET /api/products returns product list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});

// ── Response headers ─────────────────────────────────────────────────────────

describe('Mock mode — x-shadowapi headers', () => {
  const app = buildApp('mock');

  test('mock routes set x-shadowapi-source: mock', async () => {
    const res = await request(app).get('/api/users');
    expect(res.headers['x-shadowapi-source']).toBe('mock');
  });

  test('mock routes set x-shadowapi-mode: mock', async () => {
    const res = await request(app).get('/api/users');
    expect(res.headers['x-shadowapi-mode']).toBe('mock');
  });

  test('404 response sets x-shadowapi-source: mock', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.headers['x-shadowapi-source']).toBe('mock');
  });
});

// ── Health endpoint ───────────────────────────────────────────────────────────

describe('Health endpoint', () => {
  const app = buildApp('mock');

  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.mode).toBe('mock');
  });
});

// ── Proxy fallback — backend 404 ──────────────────────────────────────────────

describe('Proxy mode — fallback on backend 404', () => {
  let fakeBackend;
  let backendUrl;

  beforeAll(() => new Promise((resolve) => {
    fakeBackend = http.createServer((req, res) => {
      res.writeHead(404);
      res.end('Not Found');
    });
    fakeBackend.listen(0, () => {
      backendUrl = `http://localhost:${fakeBackend.address().port}`;
      resolve();
    });
  }));

  afterAll(() => new Promise((resolve) => fakeBackend.close(resolve)));

  test('falls back to mock when backend returns 404', async () => {
    const app = buildApp('hybrid', backendUrl);
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.headers['x-shadowapi-source']).toBe('mock');
  });
});

// ── Proxy fallback — backend unreachable ─────────────────────────────────────

describe('Proxy mode — fallback when backend is unreachable', () => {
  test('falls back to mock when backend connection refused', async () => {
    // port 19999 should be nothing listening
    const app = buildApp('hybrid', 'http://localhost:19999');
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.headers['x-shadowapi-source']).toBe('mock');
  });
});

// ── Proxy mode — real backend responds ───────────────────────────────────────

describe('Proxy mode — forwards to real backend', () => {
  let fakeBackend;
  let backendUrl;

  beforeAll(() => new Promise((resolve) => {
    fakeBackend = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ users: [{ id: 99, name: 'Real' }] }));
    });
    fakeBackend.listen(0, () => {
      backendUrl = `http://localhost:${fakeBackend.address().port}`;
      resolve();
    });
  }));

  afterAll(() => new Promise((resolve) => fakeBackend.close(resolve)));

  test('forwards request and returns real backend response', async () => {
    const app = buildApp('proxy', backendUrl);
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.headers['x-shadowapi-source']).toBe('real');
    expect(res.headers['x-shadowapi-mode']).toBe('proxy');
    const body = JSON.parse(res.text);
    expect(body.users[0].name).toBe('Real');
  });
});
