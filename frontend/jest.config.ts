import { getJestProjects } from '@nx/jest';
import { resolve } from 'path';

export default {
  projects: getJestProjects(),
  globals: {
    'ts-jest': {
      tsconfig: resolve(__dirname, 'tsconfig.spec.json'),
      isolatedModules: true,
    },
  },
  extensionsToTreatAsEsm: ['.ts'],
};
