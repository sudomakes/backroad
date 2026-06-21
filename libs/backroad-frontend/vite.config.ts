import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/backroad-frontend',
  // Relative asset URLs (./assets/*) so the prebuilt bundle resolves against
  // the runtime <base href> the server injects — that's what lets one build
  // serve from the domain root OR any sub-path (e.g. /backroad).
  base: './',
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
        // Required: Socket.IO upgrades from HTTP polling to WebSocket;
        // without this the socket stays in polling mode at best and
        // typically fails the upgrade with a 426.
        ws: true,
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), tailwindcss(), tsconfigPaths()],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    // `.test.*` only — `.spec.*` is reserved for Playwright e2e specs.
    include: ['src/**/*.test.{ts,tsx,js,jsx}'],
  },
});
