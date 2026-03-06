#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

const configExists = () => fs.existsSync(path.join(process.cwd(), 'shadowapi.config.json'));

if (args.includes('--help')) {
  console.log('ShadowAPI CLI');
  process.exit(0);
}

switch (command) {
  case 'init':
    const configPath = path.join(process.cwd(), 'shadowapi.config.json');
    const openapiPath = path.join(process.cwd(), 'openapi.yaml');
    
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify({
        port: 3000,
        contract: 'openapi.yaml',
        backend: null
      }, null, 2));
      console.log('Created shadowapi.config.json');
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
      console.log('Created openapi.yaml');
    }
    break;
  case 'start':
    if (!configExists()) {
      console.log('No config found. Run: shadowapi init');
      process.exit(1);
    }
    console.log('Starting ShadowAPI...');
    break;
  default:
    console.log('ShadowAPI CLI');
}
