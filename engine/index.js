const schema = require("./schema.json");
const { simulateError } = require("./errorSimulator");
const { generateObjects } = require("./dataGenerator");
const store = require("./stateStore");

function handleRequest(req) {
  const { path, method, body } = req;

  const error = simulateError();
  if (error) {
    return {
      type: "mock",
      response: error.response
    };
  }

  const userIdMatch = path.match(/^\/users\/(\d+)$/);

  if (method === "GET" && userIdMatch) {
    const id = userIdMatch[1];
    const user = store.getById("users", id);

    if (!user) {
      return {
        type: "mock",
        response: {
          success: false,
          error: "User not found"
        }
      };
    }

    return {
      type: "mock",
      response: { success: true, data: user }
    };
  }

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

  if (method === "PUT" && userIdMatch) {
    const id = userIdMatch[1];
    const updated = store.update("users", id, body);

    return {
      type: "mock",
      response: { success: true, data: updated }
    };
  }

  if (method === "DELETE" && userIdMatch) {
    const id = userIdMatch[1];
    const removed = store.remove("users", id);

    return {
      type: "mock",
      response: { success: removed }
    };
  }

  return { type: "forward" };
}

module.exports = { handleRequest };