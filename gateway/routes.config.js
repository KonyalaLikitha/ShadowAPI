module.exports = [
  {
    method: 'GET',
    path: '/api/users',
    response: { users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] }
  },
  {
    method: 'GET',
    path: '/api/products',
    response: { products: [{ id: 1, title: 'Laptop' }] }
  }
];
