# Engine — Mock Core

The engine is the brain of ShadowAPI. It handles all mock data generation, in-memory state, error simulation, and fallback logic when a real backend is unavailable.

---

## Folder Structure

```
engine/
 ├── index.js            ← main entry point (handleRequest)
 ├── schema.json         ← route + field definitions
 ├── dataGenerator.js    ← generates mock objects from schema
 ├── stateStore.js       ← in-memory CRUD state
 ├── errorSimulation.js  ← probabilistic error injection
 ├── fallbackHandler.js  ← fallback logic when backend fails
 ├── responseValidator.js← validates mock shape against real response
 └── tests/
     └── engine.test.js  ← Jest test suite (32 tests)
```

---

## How It Works

Every incoming request flows through `handleRequest` in `index.js`:

```
Request
  │
  ├─ simulateError?  ──yes──► return error response (400/429/500/503)
  │
  ├─ route match in schema.json?  ──no──► return { type: "forward" }
  │
  ├─ GET /resource        → stateStore.get()  or  dataGenerator.generateObjects()
  ├─ GET /resource/:id    → stateStore.getById()  or  dataGenerator.generateSingle()
  ├─ POST /resource       → dataGenerator.generateSingle() + stateStore.add()
  ├─ PUT /resource/:id    → stateStore.update()  or  dataGenerator.generateSingle()
  └─ DELETE /resource/:id → stateStore.remove()
```

If a `realSample` is passed (from the gateway after a real backend call), `responseValidator` checks the shape and regenerates a compatible mock if there's a mismatch.

---

## Modules

### `index.js` — handleRequest

Main entry point used by the gateway.

```js
const { handleRequest } = require('./engine');

const result = handleRequest({ path: '/users', method: 'GET' });
// result.type   → "mock" | "forward"
// result.status → 200 | 400 | 429 | 500 | 503
// result.response → { success, data }
```

---

### `schema.json` — Route & Field Definitions

Defines which routes the engine handles and what fields each resource has.

```json
{
  "routes": [
    { "method": "GET",    "path": "/users" },
    { "method": "POST",   "path": "/users" },
    { "method": "GET",    "path": "/users/:id" },
    { "method": "PUT",    "path": "/users/:id" },
    { "method": "DELETE", "path": "/users/:id" }
  ],
  "fields": {
    "users": {
      "name":   "string",
      "email":  "email",
      "age":    "number",
      "active": "boolean"
    }
  }
}
```

Supported field types: `string`, `number`, `email`, `boolean`

---

### `dataGenerator.js` — Mock Data Generation

Generates mock objects based on the schema field definitions.

```js
const { generateObjects, generateSingle } = require('./dataGenerator');

generateObjects('users', 5);
// → [{ id: 1, name: 'mock_abc', email: 'user42@example.com', ... }, ...]

generateSingle('users', { id: 10 });
// → { id: 10, name: 'mock_xyz', email: 'user7@example.com', ... }
```

---

### `stateStore.js` — In-Memory State

Holds live state across requests within a session. Starts with seed data.

```js
const store = require('./stateStore');

store.get('users')           // → all users
store.getById('users', 1)    // → single user or undefined
store.add('users', { name: 'Alice' })     // → { id: 3, name: 'Alice', ... }
store.update('users', 1, { name: 'Bob' }) // → updated item or null
store.remove('users', 1)                  // → true or false
```

State resets on server restart (in-memory only).

---

### `errorSimulation.js` — Probabilistic Error Injection

Randomly injects realistic backend errors to simulate real-world conditions.

| Error | Status | Trigger condition |
|---|---|---|
| Internal server error | 500 | ~5% of all requests |
| Too many requests | 429 | ~3% of GET requests |
| Bad request | 400 | ~2% of POST/PUT requests |
| Service unavailable | 503 | ~1% of all requests |

```js
const { simulateError } = require('./errorSimulation');

const err = simulateError('GET');
// → null  (most of the time)
// → { status: 500, response: { success: false, error: '...' } }
```

---

### `fallbackHandler.js` — Backend Failure Fallback

Called by the gateway when the real backend returns an error or is unreachable.

```js
const { handleBackendFailure, shouldFallback } = require('./fallbackHandler');

shouldFallback(503); // → true
shouldFallback(200); // → false

handleBackendFailure({ status: 500 }, req);
// → { type: 'fallback', status: 200, response: { success: true, data: [...] } }

handleBackendFailure({ status: 200 }, req);
// → { type: 'backend', response: backendResponse }
```

---

### `responseValidator.js` — Shape Validation

When a real backend response is available, validates that the mock response has the same shape. Regenerates a compatible mock if there's a mismatch.

```js
const { validateMock } = require('./responseValidator');

const result = validateMock(realResponse, mockResponse);
// → mockResponse if shapes match
// → regenerated compatible mock if mismatch detected
```

---

## Running Tests

```bash
npm run test:engine
```

32 tests across all engine modules — dataGenerator, stateStore, errorSimulation, handleRequest, fallbackHandler, responseValidator.

---

## Adding a New Resource

1. Add routes to `schema.json` under `"routes"`
2. Add field definitions under `"fields"`

Example — adding `products`:

```json
"routes": [
  { "method": "GET",  "path": "/products" },
  { "method": "POST", "path": "/products" }
],
"fields": {
  "products": {
    "name":  "string",
    "price": "number",
    "inStock": "boolean"
  }
}
```

No code changes needed — the engine picks it up automatically.
