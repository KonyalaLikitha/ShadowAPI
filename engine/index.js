const schema = require("./schema.json");
const { simulateError } = require("./errorSimulation.js");
const { generateObjects, generateSingle } = require("./dataGenerator");
const { validateMock } = require("./responseValidator");
const store = require("./stateStore");

// Called directly by gateway/router.js — returns { status, body }
function handleMockRequest(req) {
  const method = req.method;
  const path   = req.path;
  const body   = req.body || {};

  // /api/hello — always works, good for demo
  if (path === '/api/hello' && method === 'GET') {
    return { status: 200, body: { message: 'Hello from Mock Engine', source: 'mock' } };
  }

  // /api/error — intentional error simulation endpoint
  if (path === '/api/error') {
    return { status: 500, body: { error: 'Internal Server Error (Mock)' } };
  }

  const error = simulateError(method);
  if (error) {
    console.log(`[Engine] Simulated ${error.status}: ${error.response.error}`);
    return { status: error.status, body: error.response };
  }

  // strip /api prefix so engine resource logic works: /api/users → /users
  const strippedPath = path.replace(/^\/api/, '') || '/';
  const idMatch      = strippedPath.match(/^\/([^/]+)\/(\d+)$/);
  const resource     = strippedPath.split('/')[1] || 'users';

  const routeExists = schema.routes.some(r => {
    if (r.method !== method) return false;
    const stripped = r.path.replace(/^\/api/, '');
    if (stripped === strippedPath) return true;
    if (stripped === `/${resource}/:id` && idMatch) return true;
    return false;
  });

  if (!routeExists) {
    console.log(`[Engine] No route for ${method} ${path} → forward`);
    return null; // null = gateway should forward to backend
  }

  let data;

  if (method === 'GET' && !idMatch) {
    let items = store.get(resource);
    if (!items || items.length === 0) items = generateObjects(resource, 5);
    data = { [resource]: items };
    return { status: 200, body: { success: true, data } };
  }

  if (method === 'GET' && idMatch) {
    const id   = idMatch[2];
    let   item = store.getById(resource, id) || generateSingle(resource, { id: Number(id) });
    return { status: 200, body: { success: true, data: item } };
  }

  if (method === 'POST') {
    const created = store.add(resource, generateSingle(resource, body));
    console.log(`[Engine] Created ${resource}:`, created.id);
    return { status: 201, body: { success: true, data: created } };
  }

  if (method === 'PUT' && idMatch) {
    const id      = idMatch[2];
    const updated = store.update(resource, id, body) || generateSingle(resource, { id: Number(id), ...body });
    return { status: 200, body: { success: true, data: updated } };
  }

  if (method === 'DELETE' && idMatch) {
    const id      = idMatch[2];
    const removed = store.remove(resource, id);
    return { status: removed ? 204 : 404, body: removed ? null : { error: 'Not found' } };
  }

  return { status: 404, body: { error: 'Not Found (Mock)' } };
}

// Legacy internal function — kept for engine tests + fallbackHandler
function handleRequest(req, realSample = null) {
  const { path, method, body } = req;
  console.log(`[Engine] ${method} ${path} received`);

  const error = simulateError(method);
  if (error) {
    console.log(`[Engine] Simulated ${error.status}: ${error.response.error}`);
    return { type: 'mock', status: error.status, response: error.response };
  }

  const userIdMatch = path.match(/^\/users\/(\d+)$/);
  const resource    = path.split('/')[1] || 'users';

  const route = schema.routes.some(r => {
    if (r.method !== method) return false;
    const stripped = r.path.replace(/^\/api/, '');
    if (stripped === path) return true;
    if (stripped === `/${resource}/:id` && userIdMatch) return true;
    return false;
  });

  if (!route) {
    console.log(`[Engine] No matching route → forward to backend`);
    return { type: 'forward', status: null };
  }

  let mockResponse;

  if (method === 'GET' && !userIdMatch) {
    let data = store.get(resource);
    if (!data || data.length === 0) data = generateObjects(resource, 10);
    mockResponse = { success: true, data };
  } else if (method === 'GET' && userIdMatch) {
    const id   = userIdMatch[1];
    const user = store.getById(resource, id) || generateSingle(resource, { id: Number(id) });
    mockResponse = { success: true, data: user };
  } else if (method === 'POST') {
    const created = store.add(resource, generateSingle(resource, body));
    mockResponse = { success: true, data: created };
  } else if (method === 'PUT' && userIdMatch) {
    const id      = userIdMatch[1];
    const updated = store.update(resource, id, body) || generateSingle(resource, { id: Number(id), ...body });
    mockResponse = { success: true, data: updated };
  } else if (method === 'DELETE' && userIdMatch) {
    const id      = userIdMatch[1];
    const removed = store.remove(resource, id);
    mockResponse = { success: removed !== false, data: { message: 'Deleted' } };
  }

  if (realSample) mockResponse = validateMock(realSample, mockResponse);

  return { type: 'mock', status: 200, response: mockResponse };
}

module.exports = { handleMockRequest, handleRequest };

