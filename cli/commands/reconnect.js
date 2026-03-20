const log = require('../logger');
const {
  configExists,
  readConfigForStatus,
  checkBackendConnection
} = require('./shared');

module.exports = function () {
  if (!configExists()) {
    log.error('No config found. Run: shadowapi init');
    process.exit(1);
  }

  let config;

  try {
    config = readConfigForStatus();
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }

  if (!config.backend) {
    log.error('Backend not configured. Run: shadowapi connect <backend_url>');
    process.exit(1);
  }

  log.info('Checking backend connection...');

  checkBackendConnection(config.backend, (backendStatus) => {
    if (backendStatus === 'reachable') {
      log.success('Backend reachable');
      return;
    }

    log.error('Backend unreachable');
  });
};
