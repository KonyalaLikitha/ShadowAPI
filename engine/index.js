const schema = require("./schema.json");
const { generateObjects } = require("./dataGenerator");
const store = require("./stateStore");

function handleRequest(req) {
  const { path, method, body } = req;

  const route = schema.routes.find(
    (r) => r.method === method && r.path === path
  );

  const resource = path.replace("/", "");

  if (route) {

    if (method === "GET") {
      const data = store.get(resource);
      return {
        type: "mock",
        response: { success: true, data }
      };
    }

    if (method === "POST") {
      const created = store.add(resource, body);
      return {
        type: "mock",
        response: { success: true, data: created }
      };
    }
  }

  return { type: "forward" };
}

module.exports = { handleRequest };