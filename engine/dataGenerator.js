function generateObjects(type, count = 2) {
  const objects = [];

  for (let i = 1; i <= count; i++) {
    if (type === "users") {
      objects.push({
        id: i,
        name: `User${i}`
      });
    }

    if (type === "orders") {
      objects.push({
        id: i,
        item: `Item${i}`
      });
    }

    if (type === "products") {
      objects.push({
        id: i,
        name: `Product${i}`,
        price: 100 + i
      });
    }
  }

  return objects;
}

module.exports = { generateObjects };