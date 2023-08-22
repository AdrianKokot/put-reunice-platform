export default {
  displayName: 'reunice',
  preset: './jest.preset.js',
  coverageDirectory: './coverage/reunice',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
