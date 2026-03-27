const { handleRequest } = require('./index');
const { generateObjects, generateSingle } = require('./dataGenerator');

function handleBackendFailure(backendResponse, req) {
  const { status } = backendResponse;

  if (status >= 500) {
    console.log(`[Fallback] Backend server error (${status}) → mock fallback`);
    const fallback = handleRequest(req);
    return { type: 'fallback', status: 200, response: fallback.response };
  }

  if (status === 404) {
    console.log(`[Fallback] Backend 404 → generating mock data`);
    const resource = req.path.split('/')[1] || 'users';
    const data = req.method === 'GET'
      ? { success: true, data: generateObjects(resource, 3) }
      : { success: true, data: generateSingle(resource) };
    return { type: 'fallback', status: 200, response: data };
  }

  console.log(`[Fallback] Backend responded (${status}) → no fallback needed`);
  return { type: 'backend', response: backendResponse };
}

function shouldFallback(status) {
  return status >= 400;
}

module.exports = { handleBackendFailure, shouldFallback };
