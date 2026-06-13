import { type TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Apply the Storybook theme to the page before the axe scan.
 * Backroad uses daisyUI's `data-theme` attribute plus Tailwind's
 * `.dark` class — we need both to be in sync for accurate contrast
 * calculations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyTheme = async (page: any, theme: string) => {
  await page.evaluate((t: string) => {
    // daisyUI uses data-theme for its component theming
    document.documentElement.setAttribute('data-theme', t);
    // Tailwind dark: variant is keyed on .dark class
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, theme);
  // Wait for the class change to settle so Tailwind's cascade updates
  await page.waitForFunction(
    (t: string) =>
      document.documentElement.classList.contains('dark') === (t === 'dark'),
    theme
  );
};

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    // Apply theme before scanning so contrast calculations are accurate.
    // STORYBOOK_THEME is set in CI; defaults to dark for local dev.
    const theme = process.env.STORYBOOK_THEME ?? 'dark';
    await applyTheme(page, theme);

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
