import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/backroad-frontend',
  build: {
    outDir: '../../dist/libs/backroad-frontend',
    emptyOutDir: true,
  },

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        secure: false,
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), tsconfigPaths()],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    // `.test.*` only — `.spec.*` is reserved for Playwright e2e specs.
    include: ['src/**/*.test.{ts,tsx,js,jsx}'],
  },
});
