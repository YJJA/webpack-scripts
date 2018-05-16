module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'packages/**/*.js',
    '!**/__tests__/**',
    '!**/scripts/**',
    '!**/node_modules/**',
    '!**/build/**'
  ],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>/scripts/jest/styleMock.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/scripts/jest/assetMock.js'
  },
  setupFiles: [
    '<rootDir>/scripts/jest/enzyme.js'
  ]
}
