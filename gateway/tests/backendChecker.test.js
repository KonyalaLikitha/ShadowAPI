const http = require('http');
const checkBackend = require('../backendChecker');

describe('backendChecker', () => {
  test('returns reachable true for a live server', async () => {
    const server = http.createServer((req, res) => { res.writeHead(200); res.end(); });
    await new Promise(r => server.listen(0, r));
    const url = `http://localhost:${server.address().port}`;

    const result = await checkBackend(url);
    expect(result.reachable).toBe(true);
    expect(typeof result.latency).toBe('number');
    expect(result.statusCode).toBe(200);

    await new Promise(r => server.close(r));
  });

  test('returns reachable false when nothing is listening', async () => {
    const result = await checkBackend('http://localhost:19998');
    expect(result.reachable).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('returns reachable false for invalid URL', async () => {
    const result = await checkBackend('not-a-url');
    expect(result.reachable).toBe(false);
    expect(result.error).toBe('invalid URL');
  });
});
