module.exports = [
  {
    method: 'GET',
    path: '/api/users',
    response: { users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] }
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    response: { id: 1, name: 'John', email: 'john@example.com' }
  },
  {
    method: 'GET',
    path: '/api/products',
    response: { products: [{ id: 1, title: 'Laptop' }] }
  },
  {
    method: 'GET',
    path: '/api/products/:id',
    response: { id: 1, title: 'Laptop', price: 999 }
  },
  {
    method: 'POST',
    path: '/api/users',
    status: 201,
    response: { id: 3, name: 'New User', created: true }
  }
];
