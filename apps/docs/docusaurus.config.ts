import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Backroad',
  tagline: 'Server-driven React UIs you write in TypeScript',
  favicon: 'img/favicon.ico',

  url: 'https://backroad.sudomakes.art',
  baseUrl: '/docs/',

  organizationName: 'sudomakes',
  projectName: 'backroad',
  // Pages is published from the gh-pages artifact, not from a branch.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    // Generates /llms.txt + /llms-full.txt + a sibling .md for every
    // built HTML page (so consumers can fetch <page>.md and paste it
    // into an LLM). Powers the "Copy as markdown" button.
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'Backroad',
        siteDescription:
          'Server-driven React UIs you write in TypeScript. Backroad bundles ' +
          'an Express + Socket.IO runtime with a pre-built React frontend.',
      },
    ],
    './plugins/webcontainer-webpack-plugin.ts',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sudomakes/backroad/tree/main/apps/docs/',
          // Site is docs-only; mount them at baseUrl directly so URLs
          // are `/docs/<page>` (baseUrl) and not `/docs/docs/<page>`.
          routeBasePath: '/',
        },
        // Drop the blog section — not part of v1 docs scope.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // image: 'img/backroad-social-card.png', // TODO: add a social card
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Backroad',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/sudomakes/backroad',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting started', to: '/getting-started' },
            { label: 'Components', to: '/components/inputs' },
            { label: 'Authentication', to: '/auth' },
          ],
        },
        {
          title: 'Code',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sudomakes/backroad',
            },
            {
              label: 'npm — @backroad/backroad',
              href: 'https://www.npmjs.com/package/@backroad/backroad',
            },
            {
              label: 'npm — @backroad/core',
              href: 'https://www.npmjs.com/package/@backroad/core',
            },
          ],
        },
      ],
      copyright: `Built with Docusaurus · © ${new Date().getFullYear()} Backroad contributors`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'tsx', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
