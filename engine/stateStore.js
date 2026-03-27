const state = {
  users: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, active: true },
    { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   age: 34, active: true },
    { id: 3, name: 'Carol White',   email: 'carol@example.com', age: 22, active: false },
  ]
};

function get(resource) {
  return state[resource] || [];
}

function add(resource, item) {
  if (!state[resource]) state[resource] = [];
  const newItem = { id: state[resource].length + 1, ...item };
  state[resource].push(newItem);
  return newItem;
}

function getById(resource, id) {
  return (state[resource] || []).find(item => item.id === Number(id));
}

function update(resource, id, newData) {
  const items = state[resource] || [];
  const index = items.findIndex(item => item.id === Number(id));
  if (index === -1) return null;
  items[index] = { ...items[index], ...newData };
  return items[index];
}

function remove(resource, id) {
  const items = state[resource] || [];
  const index = items.findIndex(item => item.id === Number(id));
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

module.exports = { get, add, getById, update, remove };
