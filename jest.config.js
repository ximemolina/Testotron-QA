module.exports = {
  testEnvironment: 'node',

  // dónde están tus tests
  testMatch: ['**/evidencia-pruebas/pruebas-unitarias/**/*.test.js'],

  // opcional: aliases para imports limpios
  moduleDirectories: ['node_modules', 'testotron/api'],

  clearMocks: true
};