import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Marketing site for backroad.sudomakes.art. Deployed to GitHub Pages
// at the root (docs live under /docs/ via a separate Docusaurus build).
// Static SPA — meta tags ship in static HTML so OG/Twitter previews
// work; React hydrates on load for the interactive bits.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/apps/landing',
    emptyOutDir: true,
    target: 'es2022',
    cssMinify: 'lightningcss',
  },
  server: {
    port: 3002,
    host: 'localhost',
  },
});
