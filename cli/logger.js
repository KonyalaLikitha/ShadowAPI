const log = {
  info: (message) => {
    console.log(`ShadowAPI: ${message}`);
  },

  success: (message) => {
    console.log(`✓ ShadowAPI: ${message}`);
  },

  error: (message) => {
    console.error(`✗ ShadowAPI: ${message}`);
  }
};

module.exports = log;