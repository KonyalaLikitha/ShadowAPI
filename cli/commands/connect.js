const fs = require('fs');
const path = require('path');
const log = require('../logger');
const { configExists } = require('./shared');

module.exports = function (args) {
  if (!configExists()) {
    log.error('No config found. Run: shadowapi init');
    process.exit(1);
  }

  const backendUrl = args[0];

  if (!backendUrl) {
    log.error('Usage: shadowapi connect <backend_url>');
    process.exit(1);
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(backendUrl);
  } catch (err) {
    log.error('Invalid backend URL. Use http:// or https://');
    process.exit(1);
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    log.error('Invalid backend URL. Use http:// or https://');
    process.exit(1);
  }

  const configPath = path.join(process.cwd(), 'shadowapi.config.json');

  try {
    const currentContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(currentContent);

    config.backend = backendUrl;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    log.success('Backend connected');
    log.info(backendUrl);
  } catch (err) {
    log.error('Invalid shadowapi.config.json format');
    process.exit(1);
  }
};