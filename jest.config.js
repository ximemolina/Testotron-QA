module.exports = {
  testEnvironment: 'node',

  // dónde están tus tests
  testMatch: ['**/test/unit/**/*.test.js'],

  // opcional: aliases para imports limpios
  moduleDirectories: ['node_modules', 'testotron/api'],

  clearMocks: true
};