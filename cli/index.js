#!/usr/bin/env node

const log = require('./logger');

const args = process.argv.slice(2);
const command = args[0];

const showHelp = () => {
  log.info('Commands:');
  log.info('shadowapi init                         Initialize ShadowAPI project');
  log.info('shadowapi start [--port N] [--mode M]  Start ShadowAPI server');
  log.info('shadowapi status                       Show current ShadowAPI status');
  log.info('shadowapi connect <backend_url>        Connect backend URL');
  log.info('shadowapi reconnect                    Check configured backend connection');
  log.info('shadowapi --help                       Show help');
  log.info('Modes: mock, proxy, hybrid');
};

const showCommandList = () => {
  log.info('Commands: shadowapi init | start | status | connect | reconnect | --help');
  log.info('Run shadowapi --help to see full usage.');
};

const commands = {
  init: require('./commands/init'),
  start: require('./commands/start'),
  status: require('./commands/status'),
  connect: require('./commands/connect'),
  reconnect: require('./commands/reconnect')
};

if (args.includes('--help')) {
  showHelp();
  process.exit(0);
}

if (commands[command]) {
  commands[command](args.slice(1));
} else {
  if (command) {
    log.error(`Unknown command: ${command}`);
    log.info('Run shadowapi --help to see available commands.');
  }
  showCommandList();
  process.exit(command ? 1 : 0);
}
