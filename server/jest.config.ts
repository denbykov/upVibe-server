import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/tests/unit/**/*.test.ts'],
  clearMocks: true,
  transformIgnorePatterns: ['node_modules/(?!(lodash-es|@src)/)'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: 'tsconfig.test.json', diagnostics: true, useESM: true },
    ],
  },
};

export default config;
