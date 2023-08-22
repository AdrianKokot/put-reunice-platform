const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  'ts-jest': {
    isolatedModules: true,
  },
  setupFilesAfterEnv: ['./setup-jest.js'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  extensionsToTreatAsEsm: [`.ts`],
  transform: {
    '^(?!.*(taiga-ui-addon-editor-extensions)).*(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: './tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@tinkoff.*\\.js$)'],
};
