const { getConfig } = require('../../config/config');
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

    const modeBehavior = {
      mock: 'always use mock engine',
      proxy: 'always forward to backend',
      hybrid: 'backend first, mock fallback'
    };

    log.info('Starting ShadowAPI...');
    log.success('Configuration loaded');

    log.info(`Mode: ${config.mode}`);
    log.info(`Behavior: ${modeBehavior[config.mode]}`);
    log.info(`Port: ${config.port}`);
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
};