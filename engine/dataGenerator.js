const schema = require("./schema.json");

function generateObjects(resource, count = 5) {
  const fields = schema.fields?.[resource];
  if (!fields) return [];

  const objects = [];
  for (let i = 1; i <= count; i++) {
    const obj = { id: i };
    
    Object.entries(fields).forEach(([field, type]) => {
      obj[field] = generateField(type);
    });
    
    objects.push(obj);
  }
  return objects;
}

function generateField(type) {
  switch (type) {
    case 'number': return Math.floor(Math.random() * 1000);
    case 'string': return `mock_${Math.random().toString(36).substr(2, 6)}`;
    case 'email': return `user${Math.floor(Math.random()*1000)}@example.com`;
    case 'boolean': return Math.random() > 0.5;
    default: return `mock_${type}`;
  }
}

function generateSingle(resource, overrides = {}) {
  const fields = schema.fields?.[resource];
  if (!fields) return overrides;

  const obj = { ...overrides };
  
  Object.entries(fields).forEach(([field, type]) => {
    if (!(field in obj)) {
      obj[field] = generateField(type);
    }
  });
  
  return obj;
}

module.exports = { generateObjects, generateField, generateSingle };

