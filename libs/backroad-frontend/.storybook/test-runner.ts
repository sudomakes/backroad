import { type TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Stories own their own theme + light/dark mode per swatch: each is rendered
 * with `data-theme` and (for dark) the `.dark` class ON the same element, which
 * is how the app's ThemeProvider sets mode. We deliberately do NOT toggle a
 * global `.dark` on <html> here — named-theme dark palettes key on
 * `[data-theme=x].dark` (same element), so a global ancestor toggle would put
 * dark `dark:` utilities on light swatches while leaving their background light,
 * producing false contrast failures. The `AllThemes` showcase stories render
 * every theme in BOTH modes, so a single scan covers light + dark per theme.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
