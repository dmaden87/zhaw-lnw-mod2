import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.js', 'tests/api/**/*.test.js'],
    env: { SESSION_SECRET: 'test-secret-nur-fuer-tests', ADMIN_PASSWORD: 'admin-test-pw', ADMIN_TOKEN: 'token-test' },
  },
});
