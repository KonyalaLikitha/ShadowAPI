const fs = require('fs');
const path = require('path');
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

  try {
    const config = readConfigForStatus();
    const contractPath = path.join(process.cwd(), config.contract);
    const contractStatus = fs.existsSync(contractPath) ? 'found' : 'missing';

    log.info('Status');
    log.info(`Port: ${config.port}`);
    log.info(`Mode: ${config.mode}`);
    log.info(`Contract: ${config.contract} (${contractStatus})`);

    if (!config.backend) {
      log.info('Backend: not configured');
      return;
    } else {
      checkBackendConnection(config.backend, (backendStatus) => {
        log.info(`Backend: ${config.backend} (${backendStatus})`);
      });
    }
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
};