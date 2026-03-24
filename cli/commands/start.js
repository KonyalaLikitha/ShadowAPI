const { getConfig } = require('../../config/config');
const { startServer } = require('../../gateway');
const log = require('../logger');
const { configExists, parseArgs, validateBackendUrl } = require('./shared');

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

    if (config.backend) {
      validateBackendUrl(config.backend);
    }

    const serverUrl = `http://localhost:${config.port}`;

    log.info('Starting ShadowAPI...');
    log.success('Configuration loaded');
    log.info('Runtime');
    log.info(`Mode: ${config.mode}`);
    log.info(`Behavior: ${describeModeBehavior(config.mode)}`);
    log.info(`Server URL: ${serverUrl}`);
    if (config.backend) {
      log.info(`Backend: ${config.backend}`);
    } else {
      log.info('Backend: not configured');
    }
    log.info(`Try this URL: ${serverUrl}/api/hello`);
    log.info('Demo steps:');
    log.info('1) Open the URL above in your browser');
    log.info('2) Run shadowapi status to check contract and backend state');
    log.info('3) Run shadowapi reconnect to verify backend reachability');

    // Delegate server bootstrapping to the gateway module.
    startServer(config, () => {
      log.success('Gateway started successfully');
      log.success('ShadowAPI is ready');
    });
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
};