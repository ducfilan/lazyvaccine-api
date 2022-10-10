import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  globalSetup: './tests/config/setup.ts',
  globalTeardown: './tests/config/teardown.ts',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ]
}

export default config
