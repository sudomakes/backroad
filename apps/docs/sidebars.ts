import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'getting-started',
    'try-it',
    {
      type: 'category',
      label: 'Fundamentals',
      collapsed: false,
      items: ['fundamentals/containers', 'fundamentals/components'],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/writing-and-markdown',
        'components/inputs',
        'components/data',
        'components/charts',
        'components/multimedia',
        'components/layout',
        'components/sidebar',
        'components/llm',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: ['configuration/themes', 'auth'],
    },
    'hosting',
    {
      type: 'category',
      label: 'Advanced',
      items: ['advanced/render-paths', 'advanced/component-ids'],
    },
  ],
};

export default sidebars;
