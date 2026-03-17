const fs = require('fs');
const path = require('path');
const log = require('../logger');

module.exports = function () {
  const configPath = path.join(process.cwd(), 'shadowapi.config.json');
  const openapiPath = path.join(process.cwd(), 'openapi.yaml');

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({
      port: 3000,
      mode: 'mock',
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
};