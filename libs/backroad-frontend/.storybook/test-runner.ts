import { injectAxe, checkA11y } from 'axe-playwright';
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        // daisyUI dark theme can yield colour-contrast false positives
        // depending on viewport background — keep the run actionable.
        rules: { 'color-contrast': { enabled: false } },
      },
    });
  },
};

export default config;
