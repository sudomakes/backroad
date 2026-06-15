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
      // Baseline must be light: the AllThemes showcases render each theme in
      // both modes via a `.dark` class on the swatch itself. A global
      // `html.dark` baseline would force `dark:` utilities onto the light
      // swatches while their background stays light → false contrast failures.
      defaultTheme: 'light',
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
