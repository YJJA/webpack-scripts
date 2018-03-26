module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'src/front/containers/**/*.js',
    '!src/front/**/__tests__'
  ],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>/tools/jest/styleMock.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tools/jest/assetMock.js'
  },
  setupFiles: [
    '<rootDir>/tools/jest/enzyme.js'
  ]
}
