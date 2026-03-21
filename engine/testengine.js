const { handleRequest } = require("./index");

console.log("\n=== GET /users ===");
console.log(handleRequest({ path: "/users", method: "GET" }));

console.log("\n=== POST /users ===");
console.log(
  handleRequest({
    path: "/users",
    method: "POST",
    body: { name: "Sahithi" }
  })
);

console.log("\n=== GET /users (after POST) ===");
console.log(handleRequest({ path: "/users", method: "GET" }));

console.log("\n=== GET /users/1 ===");
console.log(handleRequest({ path: "/users/1", method: "GET" }));

console.log("\n=== PUT /users/1 ===");
console.log(
  handleRequest({
    path: "/users/1",
    method: "PUT",
    body: { name: "UpdatedName" }
  })
);

console.log("\n=== DELETE /users/1 ===");
console.log(
  handleRequest({
    path: "/users/1",
    method: "DELETE"
  })
);

console.log("\n=== GET /unknown ===");
console.log(handleRequest({ path: "/unknown", method: "GET" }));

console.log("\n=== 🔥 Day 20 Status Code Demo (10 runs GET /users) ===");
for (let i = 0; i < 10; i++) {
  const result = handleRequest({ path: "/users", method: "GET" });
  console.log(`Run ${i+1}:`, result);
}

