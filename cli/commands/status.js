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

    console.log('ShadowAPI Status\n');
    console.log(`Port: ${config.port}`);
    console.log(`Mode: ${config.mode}`);
    console.log(`Contract: ${config.contract} (${contractStatus})`);

    if (!config.backend) {
      console.log('Backend: not configured');
    } else {
      checkBackendConnection(config.backend, (backendStatus) => {
        console.log(`Backend: ${config.backend} (${backendStatus})`);
      });
    }
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
};