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
