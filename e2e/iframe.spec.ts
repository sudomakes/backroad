import { expect, test } from '@playwright/test';

// Auth is handled by the "setup auth" project in playwright.config.ts,
// which signs up once and saves storage state.  The `chromium` project
// (which runs this spec) uses that state, so we are already logged in.

test.describe('iframe component', () => {
  test('navigates to /iframe and renders iframes', async ({ page }) => {
    await page.goto('/iframe');

    // Wait for the Backroad tree to render
    await expect(
      page.getByRole('heading', { name: /iframe demo/i })
    ).toBeVisible({ timeout: 10_000 });

    // There should be two iframes on the page
    const iframes = page.locator('iframe');
    await expect(iframes).toHaveCount(2);

    // First iframe: docs embed (no sandbox)
    const first = iframes.nth(0);
    await expect(first).toHaveAttribute('title', /Backroad docs iframe embed/);
    await expect(first).toHaveAttribute('src', /localhost:3001/);
    await expect(first).toHaveAttribute('loading', 'lazy');

    // Second iframe: sandboxed
    const second = iframes.nth(1);
    await expect(second).toHaveAttribute('title', /Sandboxed docs embed/);
    await expect(second).toHaveAttribute('src', /localhost:3001/);
    await expect(second).toHaveAttribute('sandbox', /allow-scripts/);
  });
});
