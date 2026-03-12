#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { getConfig } = require('../config/config');

const log = {
  success: (msg) => console.log(`✓ ShadowAPI: ${msg}`),
  error: (msg) => console.log(`✗ ShadowAPI: ${msg}`),
  info: (msg) => console.log(`ShadowAPI: ${msg}`)
};

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
    } else if (args[i] === '--mode' && args[i + 1]) {
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

if (args.includes('--help')) {
  console.log(`
ShadowAPI CLI

Commands:
  shadowapi init    Initialize ShadowAPI project
  shadowapi start   Start ShadowAPI server
  shadowapi --help  Show help
`);
  process.exit(0);
}

switch (command) {

  case 'init':
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

  case 'start':

    if (!configExists()) {
      log.error('No config found. Run: shadowapi init');
      process.exit(1);
    }

    try {
      const overrides = parseArgs(args.slice(1));
      const config = getConfig(overrides);

      log.info('Starting ShadowAPI...');
      log.info('Configuration:');
      console.log(JSON.stringify(config, null, 2));
    } catch (err) {
      log.error(err.message);
      process.exit(1);
    }

    break;


  default:
    console.log(`
ShadowAPI CLI

Commands:
  shadowapi init
  shadowapi start
  shadowapi --help
`);
}