const log = require('../logger');
const { configExists, saveConfig } = require('./shared');

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

  try {
    saveConfig({ backend: backendUrl });

    log.success('Backend connected');
    log.info(`Backend: ${backendUrl}`);
  } catch (err) {
    log.error('Invalid shadowapi.config.json format');
    process.exit(1);
  }
};