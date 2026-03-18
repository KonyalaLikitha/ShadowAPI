#!/usr/bin/env node

const log = require('./logger');

const args = process.argv.slice(2);
const command = args[0];

const showHelp = () => {
  log.info(`
Commands:
  shadowapi init    Initialize ShadowAPI project
  shadowapi start   Start ShadowAPI server
  shadowapi status  Show current ShadowAPI status
  shadowapi connect <backend_url>  Connect backend URL
  shadowapi --help  Show help
`);
};

const showCommandList = () => {
  log.info(`
Commands:
  shadowapi init
  shadowapi start
  shadowapi status
  shadowapi connect <backend_url>
  shadowapi --help
`);
};

const commands = {
  init: require('./commands/init'),
  start: require('./commands/start'),
  status: require('./commands/status'),
  connect: require('./commands/connect')
};

if (args.includes('--help')) {
  showHelp();
  process.exit(0);
}

if (commands[command]) {
  commands[command](args.slice(1));
} else {
  showCommandList();
}