// Route definitions only — responses are handled by engine/index.js
module.exports = [
  { method: 'GET',    path: '/api/hello' },
  { method: 'GET',    path: '/api/users' },
  { method: 'GET',    path: '/api/users/:id' },
  { method: 'POST',   path: '/api/users' },
  { method: 'PUT',    path: '/api/users/:id' },
  { method: 'DELETE', path: '/api/users/:id' },
  { method: 'GET',    path: '/api/products' },
  { method: 'GET',    path: '/api/products/:id' },
  { method: 'GET',    path: '/api/error' },
];
