function simulateError() {
  const random = Math.random();

  if (random < 0.1) {
    return {
      status: 500,
      response: {
        success: false,
        error: "Internal server error"
      }
    };
  }

  return null;
}

module.exports = { simulateError };