//Basic engine that forwards all requests to the next handler in the chain.
function handleRequest(req) {
  const { path, method } = req;

  if (method === "GET" && path === "/users") {
    return {
      type: "mock",
      response: {
        success: true,
        data: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" }
        ]
      }
    };
  }

  return { type: "forward" };
}

module.exports = { handleRequest };