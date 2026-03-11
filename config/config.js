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

  const finalConfig = {
    port: overrides.port || config.port || 3000,
    mode: overrides.mode || config.mode || 'mock',
    contract: config.contract || 'openapi.yaml',
    backend: config.backend || null
  };

  // Validate port
  if (typeof finalConfig.port !== 'number' || isNaN(finalConfig.port) || finalConfig.port < 1 || finalConfig.port > 65535) {
    throw new Error('Invalid port in shadowapi.config.json');
  }

  // Validate mode
  if (!['mock', 'proxy', 'hybrid'].includes(finalConfig.mode)) {
    throw new Error('Invalid mode in shadowapi.config.json');
  }

  // Validate contract file exists
  const contractPath = path.join(process.cwd(), finalConfig.contract);
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Contract file ${finalConfig.contract} not found`);
  }

  return finalConfig;
}

module.exports = { getConfig };