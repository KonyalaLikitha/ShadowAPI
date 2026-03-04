#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0];

if (args.includes('--help')) {
  console.log('ShadowAPI CLI');
  process.exit(0);
}

switch (command) {
  case 'start':
    console.log('Starting ShadowAPI...');
    break;
  default:
    console.log('ShadowAPI CLI');
}
