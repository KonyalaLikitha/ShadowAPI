//Basic engine that forwards all requests to the next handler in the chain.
function handleRequest(req) {
  return { type: "forward" };
}

module.exports = { handleRequest };