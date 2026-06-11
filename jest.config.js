module.exports = {
  testEnvironment: 'node',

  // dónde están tus tests
  testMatch: ['**/evidencia-pruebas/pruebas-unitarias/**/*.test.js'],

  // opcional: aliases para imports limpios
  moduleDirectories: ['node_modules', 'testotron/api'],

  moduleNameMapper: {
    '^better-sqlite3$': '<rootDir>/__mocks__/better-sqlite3.js',
    '^bcrypt$': '<rootDir>/__mocks__/bcrypt.js'
  },

  clearMocks: true
};