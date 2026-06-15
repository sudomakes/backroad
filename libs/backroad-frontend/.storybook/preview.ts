import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'dark',
      parentSelector: 'html',
    }),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
    a11y: {
      context: '#storybook-root',
      test: 'error',
      options: {
        rules: { 'color-contrast': { enabled: true } },
      },
    },
  },
};

export default preview;
