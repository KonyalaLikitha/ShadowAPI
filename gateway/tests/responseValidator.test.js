const validateResponse = require('../responseValidator');

const routes = [
  { method: 'GET', path: '/api/users', response: { users: [] } },
  { method: 'GET', path: '/api/products', response: { products: [] } },
  { method: 'GET', path: '/api/users/:id', response: (p) => ({ id: p.id }) },
];

let warnSpy, logSpy;

beforeEach(() => {
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
  logSpy.mockRestore();
});

test('logs match when response shape is identical', () => {
  validateResponse('/api/users', routes, { users: [] });
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('matches mock'));
  expect(warnSpy).not.toHaveBeenCalled();
});

test('warns on missing fields', () => {
  validateResponse('/api/users', routes, { something: [] });
  expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('missing fields: users'));
});

test('warns on extra fields', () => {
  validateResponse('/api/users', routes, { users: [], extra: true });
  expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('extra fields: extra'));
});

test('skips validation for dynamic (function) routes', () => {
  validateResponse('/api/users/:id', routes, { id: '1', name: 'John' });
  expect(warnSpy).not.toHaveBeenCalled();
  expect(logSpy).not.toHaveBeenCalled();
});

test('skips validation when route not found', () => {
  validateResponse('/api/unknown', routes, { foo: 'bar' });
  expect(warnSpy).not.toHaveBeenCalled();
});

test('skips validation for non-object body', () => {
  validateResponse('/api/users', routes, null);
  expect(warnSpy).not.toHaveBeenCalled();
});
