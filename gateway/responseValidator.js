/**
 * Compares top-level keys of a real backend response body
 * against the expected shape from the mock route definition.
 * Logs a warning if fields are missing or extra fields appear.
 */

function extractExpectedKeys(route) {
  if (!route) return null;
  const { response } = route;
  if (!response) return null;
  if (typeof response === 'function') return null; // dynamic — skip
  return Object.keys(response);
}

function validateResponse(routePath, routes, realBody) {
  if (!realBody || typeof realBody !== 'object') return;

  const route = routes.find(r => r.path === routePath && r.method === 'GET');
  const expectedKeys = extractExpectedKeys(route);
  if (!expectedKeys) return;

  const realKeys = Object.keys(realBody);
  const missing = expectedKeys.filter(k => !realKeys.includes(k));
  const extra = realKeys.filter(k => !expectedKeys.includes(k));

  if (missing.length) {
    console.warn(
      `\x1b[33m[validator]\x1b[0m ${routePath} — real response missing fields: ${missing.join(', ')}`
    );
  }
  if (extra.length) {
    console.warn(
      `\x1b[33m[validator]\x1b[0m ${routePath} — real response has extra fields: ${extra.join(', ')}`
    );
  }
  if (!missing.length && !extra.length) {
    console.log(`\x1b[32m[validator]\x1b[0m ${routePath} — response shape matches mock ✓`);
  }
}

module.exports = validateResponse;
