//Basic engine that forwards all requests to the next handler in the chain.
function handleRequest(req) {
  const { path, method } = req;

  // First mock route
  if (path === "/users" && method === "GET") {
    return {
      type: "mock",
      response: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
      ]
    };
  }

  // Everything else forward
  return { type: "forward" };
}

module.exports = { handleRequest };