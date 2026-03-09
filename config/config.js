const fs = require('fs');
const path = require('path');

function getConfig(overrides = {}) {
  const configPath = path.join(process.cwd(), 'shadowapi.config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error("No config found. Run: shadowapi init");
  }

  let config;

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(content);
  } catch (err) {
    throw new Error("Invalid shadowapi.config.json format");
  }

  return {
    port: overrides.port || config.port || 3000,
    mode: overrides.mode || config.mode || 'mock',
    contract: config.contract || 'openapi.yaml',
    backend: config.backend || null
  };
}

module.exports = { getConfig };