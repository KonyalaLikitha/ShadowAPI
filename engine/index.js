//Basic engine that forwards all requests to the next handler in the chain.
const schema = require("./schema.json");
const { generateObjects } = require("./dataGenerator");

function handleRequest(req) {
  const { path, method } = req;

  const route = schema.routes.find(
    (r) => r.method === method && r.path === path
  );

  if (route) {

    let response = route.response;
    const resource = path.replace("/", "");

    response = {
      success: true,
      data: generateObjects(resource)
    };

    return {
      type: "mock",
      response
    };
  }

  return { type: "forward" };
}

module.exports = { handleRequest };