module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Transform JavaScript files using Babel
    },
    transformIgnorePatterns: [
      'node_modules/(?!axios)', // Transpile axios since it's an ESM module
    ],
    moduleNameMapper: {
      '\\.(css|jpg|png)$': '<rootDir>/__mocks__/fileMock.js', // Mock static files if needed
    },
  };
  