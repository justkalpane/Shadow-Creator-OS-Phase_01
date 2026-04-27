export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js'],
  collectCoverageFrom: [
    'validators/**/*.js',
    'engines/**/*.js',
    'scripts/**/*.js',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
  verbose: true,
  bail: false,
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  },
  transformIgnorePatterns: ['node_modules/(?!(yaml)/)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
