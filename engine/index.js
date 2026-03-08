//Basic engine that forwards all requests to the next handler in the chain.
const schema = require("./schema.json");

/**
 * Handles incoming API requests
 * Returns mock response if route exists in schema
 */
function handleRequest(req) {
  const { path, method } = req;

  // find matching route in schema
  const route = schema.routes.find(
    (r) => r.method === method && r.path === path
  );

  // return mock response
  if (route) {
    return {
      type: "mock",
      response: route.response
    };
  }

  // otherwise forward to real backend
  return { type: "forward" };
}

module.exports = { handleRequest };