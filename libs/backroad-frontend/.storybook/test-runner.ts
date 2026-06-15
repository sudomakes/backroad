import { type TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Apply the Storybook light/dark mode to the page before the axe scan.
 * Light/dark is keyed on Tailwind's `.dark` class on the root (the tweakcn
 * palettes layer on top via `data-theme`, but contrast only depends on the
 * resolved light/dark tokens, so the default palette is enough here).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyTheme = async (page: any, theme: string) => {
  await page.evaluate((t: string) => {
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
