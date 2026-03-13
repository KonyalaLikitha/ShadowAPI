module.exports = [
  {
    method: 'GET',
    path: '/api/users',
    response: { users: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }] }
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    response: (params) => ({
      id: params.id,
      name: params.id === '1' ? 'John' : 'Jane',
      email: `user${params.id}@example.com`
    })
  },
  {
    method: 'GET',
    path: '/api/products',
    response: { products: [{ id: 1, title: 'Laptop' }] }
  },
  {
    method: 'GET',
    path: '/api/products/:id',
    response: (params) => ({
      id: params.id,
      title: 'Product ' + params.id,
      price: 999
    })
  },
  {
    method: 'POST',
    path: '/api/users',
    status: 201,
    response: (params, body) => ({
      id: Date.now(),
      ...body,
      created: true
    })
  },
  {
    method: 'PUT',
    path: '/api/users/:id',
    status: 200,
    response: (params, body) => ({
      id: params.id,
      ...body,
      updated: true
    })
  },
  {
    method: 'DELETE',
    path: '/api/users/:id',
    status: 204,
    response: () => null
  },
  {
    method: 'PUT',
    path: '/api/products/:id',
    status: 200,
    response: (params, body) => ({
      id: params.id,
      ...body,
      updated: true
    })
  },
  {
    method: 'DELETE',
    path: '/api/products/:id',
    status: 204,
    response: () => null
  }
];
