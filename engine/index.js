//Basic engine that forwards all requests to the next handler in the chain.
const schema = require("./schema.json");

function handleRequest(req) {
  const { path, method } = req;

  const route = schema.routes.find(
    (r) => r.method === method && r.path === path
  );

  if (route) {
    return {
      type: "mock",
      response: route.response
    };
  }

  return { type: "forward" };
}

module.exports = { handleRequest };