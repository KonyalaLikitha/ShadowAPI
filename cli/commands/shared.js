const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

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

const parseArgs = (args, log) => {
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

const showCommandList = (log) => {
  log.info(`
Commands:
  shadowapi init
  shadowapi start
  shadowapi status
  shadowapi connect <backend_url>
  shadowapi --help
`);
};

module.exports = {
  configExists,
  readConfigForStatus,
  parseArgs,
  checkBackendConnection,
  showCommandList
};