const { getConfig } = require('../../config/config');
const { startServer } = require('../../gateway');
const log = require('../logger');
const { configExists, parseArgs } = require('./shared');

module.exports = function (args) {
  if (!configExists()) {
    log.error('No config found. Run: shadowapi init');
    process.exit(1);
  }

  try {
    const overrides = parseArgs(args, log);
    const config = getConfig(overrides);

    log.info('Starting ShadowAPI...');
    log.success('Configuration loaded');
    log.info(`Mode: ${config.mode}`);
    log.info(`Port: ${config.port}`);
    log.info(`Backend: ${config.backend || 'not configured'}`);

    // Delegate server bootstrapping to the gateway module.
    startServer(config);
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
};