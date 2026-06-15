import { expect, test } from '@playwright/test';

// Auth is handled by the "setup auth" project; the chromium project loads
// the saved storage state so we are already logged in when these run.

const OPEN_SIDEBAR = /open sidebar/i;
const CLOSE_SIDEBAR = /close sidebar/i;

async function openSidebar(page: import('@playwright/test').Page) {
  const btn = page.getByRole('button', { name: OPEN_SIDEBAR });
  await expect(btn).toBeVisible({ timeout: 10_000 });
  await btn.click();
  await expect(page.getByRole('button', { name: CLOSE_SIDEBAR })).toBeVisible();
}

test.describe('sidebar sharing across pages', () => {
  // This test uses in-app React Router navigation (clicking sidebar links),
  // NOT page.goto, so the sidebar component stays mounted and we can verify
  // it never unmounts across route changes — that is exactly what the fix
  // guarantees.
  test('sidebar stays mounted and open after navigating via a sidebar link', async ({
    page,
  }) => {
    await page.goto('/');
    await openSidebar(page);

    // All nav links are present on home
    await expect(page.getByRole('link', { name: '🏠 Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: '📐 Columns' })).toBeVisible();

    // Navigate to /columns via the sidebar link (React Router — no page reload)
    await page.getByRole('link', { name: '📐 Columns' }).click();
    await expect(page).toHaveURL(/\/columns/);

    // Sidebar is still open — the component was NOT unmounted
    await expect(page.getByRole('button', { name: CLOSE_SIDEBAR })).toBeVisible(
      { timeout: 10_000 }
    );

    // Same nav links still present after navigation
    await expect(page.getByRole('link', { name: '🏠 Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: '📐 Columns' })).toBeVisible();
  });

  test('sidebar open button is present on every page (fresh loads)', async ({
    page,
  }) => {
    for (const path of ['/', '/columns', '/charts', '/markdown']) {
      await page.goto(path);
      await expect(
        page.getByRole('button', { name: OPEN_SIDEBAR }),
        `expected sidebar open button on ${path}`
      ).toBeVisible({ timeout: 10_000 });
    }
  });
});

test.describe('per-path sidebar differentiation via currentPath', () => {
  // Each page.goto triggers a fresh run with the correct currentPath, so
  // the sidebar's path indicator reflects the active route.
  test('sidebar shows the current path on home', async ({ page }) => {
    await page.goto('/');
    await openSidebar(page);
    await expect(page.getByText('📍')).toContainText('/', { timeout: 10_000 });
  });

  test('sidebar shows the current path on /columns', async ({ page }) => {
    await page.goto('/columns');
    await openSidebar(page);
    await expect(page.getByText('📍')).toContainText('/columns', {
      timeout: 10_000,
    });
  });

  test('path indicator updates after in-app navigation', async ({ page }) => {
    await page.goto('/');
    await openSidebar(page);

    // Home path shown
    await expect(page.getByText('📍')).toContainText('/', { timeout: 10_000 });

    // Navigate to /charts via sidebar link
    await page.getByRole('link', { name: '📊 Charts' }).click();
    await expect(page).toHaveURL(/\/charts/);

    // Path indicator updates to /charts after the re-run triggered by navigate
    await expect(page.getByText('📍')).toContainText('/charts', {
      timeout: 10_000,
    });
  });
});
