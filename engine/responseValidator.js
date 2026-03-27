function validateMock(realResponse, mockResponse) {
  if (!realResponse || !realResponse.data) return mockResponse;

  const realData = realResponse.data;
  const mockData = mockResponse.data || {};
  const realKeys = Object.keys(realData);
  const mockKeys = Object.keys(mockData);

  if (realKeys.length !== mockKeys.length ||
      realKeys.some(key => typeof realData[key] !== typeof mockData[key])) {
    console.log('[Engine] Schema mismatch detected → generating compatible mock');
    return generateCompatibleMock(realData);
  }

  return mockResponse;
}

function generateCompatibleMock(realSample) {
  const mock = {};
  Object.entries(realSample).forEach(([key, value]) => {
    mock[key] = generateMockValue(value);
  });
  return { success: true, data: mock };
}

function generateMockValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number')  return Math.floor(Math.random() * 1000);
  if (typeof value === 'boolean') return Math.random() > 0.5;
  if (Array.isArray(value))       return value.map(generateMockValue);
  if (typeof value === 'object')  return generateCompatibleMock(value);
  return `mock_${Math.random().toString(36).substring(2, 10)}`;
}

module.exports = { validateMock, generateCompatibleMock };
