import path from 'node:path';
import autoprefixer from 'autoprefixer';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const mockSocketPath = path.resolve(
  __dirname,
  '.ladle/mocks/backroad-socket.ts'
);

const normalizePath = (value: string) => value.replace(/\\/g, '/');

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: 'backroad-ladle-socket-mock',
      resolveId(source, importer) {
        if (!importer) {
          return null;
        }

        const normalizedImporter = normalizePath(importer);
        const normalizedSource = normalizePath(source);

        if (
          normalizedImporter.includes('/libs/backroad-client/src/lib/') &&
          /(^|\/)socket(\.[cm]?[jt]sx?)?$/.test(normalizedSource)
        ) {
          return mockSocketPath;
        }

        return null;
      },
    },
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: path.resolve(__dirname, 'apps/client/tailwind.config.js'),
        }),
        autoprefixer(),
      ],
    },
  },
});
