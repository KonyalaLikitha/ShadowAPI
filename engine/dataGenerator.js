const schema = require("./schema.json");
const store = require("./stateStore");

function handleRequest(req) {
  const { path, method, body } = req;

  const userIdMatch = path.match(/^\/users\/(\d+)$/);

  if (method === "GET" && userIdMatch) {
    const id = userIdMatch[1];
    const user = store.getById("users", id);

    return {
      type: "mock",
      response: { success: true, data: user }
    };
  }

  const route = schema.routes.find(
    (r) => r.method === method && r.path === path
  );

  if (route) {
    const resource = path.replace("/", "");

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