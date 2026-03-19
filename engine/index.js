const schema = require("./schema.json");
const { simulateError } = require("./errorSimulation.js");
const { generateObjects, generateSingle } = require("./dataGenerator");
const { validateMock } = require("./responseValidator");
const store = require("./stateStore");

function handleRequest(req, realSample = null) {
  const { path, method, body } = req;
  console.log(`[Engine] ${method} ${path} received`);
  
  const error = simulateError();
  if (error) {
    return {
      type: "mock",
      response: error.response
    };
  }

  const userIdMatch = path.match(/^\/users\/(\d+)$/);
  const resource = path.split('/')[1] || 'users';

  const route = schema.routes.find((r) => {
    if (r.method !== method) return false;
    if (r.path === path) return true;
    if (r.path === `/${resource}/:id` && path.match(new RegExp(`^/${resource}/\\d+$`))) {
      return true;
    }
    return false;
  });

  if (!route) {
    console.log(`[Engine] No matching route → forward to backend`);
    return { type: "forward" };
  }

  let mockResponse;

  if (method === "GET" && !userIdMatch) {
    console.log(`[Engine] Returning mock ${resource} collection`);
    let data = store.get(resource);
    
    if (!data || data.length === 0) {
      data = generateObjects(resource, 10);
      store.get = () => data;
    }
    
    mockResponse = { success: true, data };

  } else if (method === "GET" && userIdMatch) {
    const id = userIdMatch[1];
    let user = store.getById(resource, id);
    
    if (!user) {
      console.log(`[Engine] User ${id} not found → generating`);
      user = generateSingle(resource, { id: Number(id) });
    }
    
    mockResponse = { success: true, data: user };

  } else if (method === "POST") {
    const created = generateSingle(resource, body) || store.add(resource, body);
    console.log(`[Engine] Created ${resource}:`, created.id);
    mockResponse = { success: true, data: created };

  } else if (method === "PUT" && userIdMatch) {
    const id = userIdMatch[1];
    const updated = store.update(resource, id, body) || generateSingle(resource, { id: Number(id), ...body });
    mockResponse = { success: true, data: updated };

  } else if (method === "DELETE" && userIdMatch) {
    const id = userIdMatch[1];
    const removed = store.remove(resource, id);
    mockResponse = { success: removed !== false, data: { message: 'Deleted' } };
  }

  if (realSample) {
    mockResponse = validateMock(realSample, mockResponse);
  }

  return {
    type: "mock",
    response: mockResponse
  };
}

module.exports = { handleRequest };

