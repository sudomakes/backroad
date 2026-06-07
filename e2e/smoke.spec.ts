import { expect, test } from '@playwright/test';

test.describe('demo app smoke', () => {
  test('home loads and shows the LLM example header', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Backroad LLM Example/i })
    ).toBeVisible();
  });

  test('chart page renders', async ({ page }) => {
    await page.goto('/charts');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('canvas').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('form page renders inputs', async ({ page }) => {
    await page.goto('/form');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input, textarea, button').first()).toBeVisible();
  });

  test('markdown page renders prose', async ({ page }) => {
    await page.goto('/markdown');
    await expect(page.locator('h1, h2, h3, p').first()).toBeVisible();
  });
});
