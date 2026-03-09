//Basic engine that forwards all requests to the next handler in the chain.
const schema = require("./schema.json");
const { generateUsers } = require("./dataGenerator");

function handleRequest(req) {
  const { path, method } = req;

  const route = schema.routes.find(
    (r) => r.method === method && r.path === path
  );

  if (route) {

    let response = route.response;

    if (path === "/users") {
      response = {
        success: true,
        data: generateUsers()
      };
    }

    return {
      type: "mock",
      response
    };
  }

  return { type: "forward" };
}

module.exports = { handleRequest };