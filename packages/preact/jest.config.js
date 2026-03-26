import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('jest').Config} */
export default {
  rootDir,
  watchman: false,
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^preact$': `${rootDir}/../../node_modules/preact/dist/preact.js`,
    '^preact/hooks$': `${rootDir}/../../node_modules/preact/hooks/dist/hooks.js`,
    '^preact/test-utils$': `${rootDir}/../../node_modules/preact/test-utils/dist/testUtils.js`,
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts'],
  displayName: 'preact',
};
