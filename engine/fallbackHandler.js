const { handleRequest } = require('./index');
const { generateObjects, generateSingle } = require('./dataGenerator');
const store = require('./stateStore');

function handleBackendFailure(backendResponse, req) {
  const { status } = backendResponse;
  
  if (status >= 500) {
    console.log(`[Fallback] Backend server error (${status}) → mock fallback`);
    const fallback = handleRequest(req);
    return {
      type: 'fallback',
      status: 200,
      response: fallback.response
    };
  }

  if (status === 404) {
    console.log(`[Fallback] Backend 404 → generating mock data`);
    const resource = req.path.split('/')[1] || 'users';
    
    let fallbackData;
    if (req.method === 'GET') {
      fallbackData = {
        success: true, 
        data: generateObjects(resource, 3)
      };
    } else {
      fallbackData = {
        success: true,
        data: generateSingle(resource)
      };
    }
    
    return {
      type: 'fallback',
      status: 200,
      response: fallbackData
    };
  }

  console.log(`[Fallback] Backend responded (${status}) → no fallback needed`);
  return {
    type: 'backend',
    response: backendResponse
  };
}

function shouldFallback(status) {
  return status >= 400;
}

module.exports = { handleBackendFailure, shouldFallback };

