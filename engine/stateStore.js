const state = {
  users: [
    { id: 1, name: "User1" },
    { id: 2, name: "User2" }
  ]
};

function get(resource) {
  return state[resource] || [];
}

function add(resource, item) {
  if (!state[resource]) {
    state[resource] = [];
  }

  const newItem = {
    id: state[resource].length + 1,
    ...item
  };

  state[resource].push(newItem);

  return newItem;
}

module.exports = { get, add };