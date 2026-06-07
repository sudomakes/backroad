import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // `.test.ts` only — `.spec.*` is reserved for Playwright e2e specs.
    include: ['src/**/*.test.ts'],
    globals: false,
  },
});
