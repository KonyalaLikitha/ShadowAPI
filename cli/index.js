#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { getConfig } = require('../config/config');
const log = require('./logger');

const args = process.argv.slice(2);
const command = args[0];

const parseArgs = (args) => {
  const parsed = {};

  for (let i = 0; i < args.length; i++) {

    if (args[i] === '--port' && args[i + 1]) {
      const port = parseInt(args[i + 1], 10);

      if (isNaN(port) || port < 1 || port > 65535) {
        log.error('Invalid port value');
        process.exit(1);
      }

      parsed.port = port;
      i++;
    }

    else if (args[i] === '--mode' && args[i + 1]) {
      const mode = args[i + 1];

      if (!['mock', 'proxy', 'hybrid'].includes(mode)) {
        log.error('Invalid mode value');
        process.exit(1);
      }

      parsed.mode = mode;
      i++;
    }
  }

  return parsed;
};

const configExists = () =>
  fs.existsSync(path.join(process.cwd(), 'shadowapi.config.json'));

const readConfigForStatus = () => {
  const configPath = path.join(process.cwd(), 'shadowapi.config.json');

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(content);

    return {
      port: config.port || 3000,
      mode: config.mode || 'mock',
      contract: config.contract || 'openapi.yaml',
      backend: config.backend || null
    };
  } catch (err) {
    throw new Error('Invalid shadowapi.config.json format');
  }
};

const checkBackendConnection = (backendUrl, callback) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(backendUrl);
  } catch (err) {
    callback('invalid URL');
    return;
  }

  const client = parsedUrl.protocol === 'https:' ? https : http;
  const requestPath = `${parsedUrl.pathname || '/'}${parsedUrl.search || ''}`;
  let completed = false;

  const done = (status) => {
    if (!completed) {
      completed = true;
      callback(status);
    }
  };

  const req = client.request({
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: requestPath,
    method: 'GET',
    timeout: 3000
  }, (res) => {
    res.resume();

    if (res.statusCode >= 200 && res.statusCode < 500) {
      done('reachable');
      return;
    }

    done(`unreachable (status ${res.statusCode})`);
  });

  req.on('timeout', () => {
    req.destroy();
    done('unreachable (timeout)');
  });

  req.on('error', () => {
    done('unreachable');
  });

  req.end();
};

if (args.includes('--help')) {

  log.info(`
Commands:
  shadowapi init    Initialize ShadowAPI project
  shadowapi start   Start ShadowAPI server
  shadowapi status  Show current ShadowAPI status
  shadowapi --help  Show help
`);

  process.exit(0);
}

switch (command) {

  case 'init': {

    const configPath = path.join(process.cwd(), 'shadowapi.config.json');
    const openapiPath = path.join(process.cwd(), 'openapi.yaml');

    if (!fs.existsSync(configPath)) {

      fs.writeFileSync(configPath, JSON.stringify({
        port: 3000,
        mode: "mock",
        contract: 'openapi.yaml',
        backend: null
      }, null, 2));

      log.success('Created shadowapi.config.json');
    }

    if (!fs.existsSync(openapiPath)) {

      fs.writeFileSync(openapiPath, `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /api/hello:
    get:
      responses:
        '200':
          description: Success
`);

      log.success('Created openapi.yaml');
    }

    break;
  }

  case 'start': {

    if (!configExists()) {
      log.error('No config found. Run: shadowapi init');
      process.exit(1);
    }

    try {

      const overrides = parseArgs(args.slice(1));
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

    break;
  }

  case 'status': {

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

    break;
  }

  default:

    log.info(`
Commands:
  shadowapi init
  shadowapi start
  shadowapi status
  shadowapi --help
`);
}