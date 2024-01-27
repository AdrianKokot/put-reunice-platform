export default {
  displayName: 'eunice',
  preset: './jest.preset.js',
  coverageDirectory: './coverage/eunice',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
