/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
