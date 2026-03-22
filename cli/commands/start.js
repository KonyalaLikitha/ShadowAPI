const { getConfig } = require('../../config/config');
const { startServer } = require('../../gateway');
const log = require('../logger');
const { configExists, parseArgs } = require('./shared');

function describeModeBehavior(mode) {
  if (mode === 'proxy') {
    return 'always backend';
  }

  if (mode === 'hybrid') {
    return 'backend first, fallback to mock';
  }

  return 'always mock';
}

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
    log.info(`Runtime behavior: ${describeModeBehavior(config.mode)}`);
    log.info(`Port: ${config.port}`);
    if (config.backend) {
      log.info(`Backend URL: ${config.backend}`);
    } else {
      log.info('Backend: not configured');
    }

    // Delegate server bootstrapping to the gateway module.
    startServer(config, ({ port }) => {
      log.success('Gateway started successfully');
      log.info(`Try accessing: http://localhost:${port}`);
    });
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
};