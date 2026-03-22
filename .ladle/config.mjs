/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: [
    'libs/**/src/**/*.stories.{js,jsx,ts,tsx,mdx}',
    'apps/**/src/**/*.stories.{js,jsx,ts,tsx,mdx}',
  ],
  viteConfig: process.cwd() + '/ladle-vite.config.ts',
  outDir: 'dist/ladle',
  port: 61000,
  previewPort: 61001,
  expandStoryTree: true,
};
