const { handleRequest } = require("./index");

// 1️⃣ GET all users
console.log("\n=== GET /users ===");
console.log(handleRequest({ path: "/users", method: "GET" }));

// 2️⃣ POST new user
console.log("\n=== POST /users ===");
console.log(
  handleRequest({
    path: "/users",
    method: "POST",
    body: { name: "Sahithi" }
  })
);

// 3️⃣ GET again (should include new user)
console.log("\n=== GET /users (after POST) ===");
console.log(handleRequest({ path: "/users", method: "GET" }));

// 4️⃣ GET single user
console.log("\n=== GET /users/1 ===");
console.log(handleRequest({ path: "/users/1", method: "GET" }));

// 5️⃣ PUT update user
console.log("\n=== PUT /users/1 ===");
console.log(
  handleRequest({
    path: "/users/1",
    method: "PUT",
    body: { name: "UpdatedName" }
  })
);

// 6️⃣ DELETE user
console.log("\n=== DELETE /users/1 ===");
console.log(
  handleRequest({
    path: "/users/1",
    method: "DELETE"
  })
);

// 7️⃣ Unknown route → should forward
console.log("\n=== GET /unknown ===");
console.log(handleRequest({ path: "/unknown", method: "GET" }));