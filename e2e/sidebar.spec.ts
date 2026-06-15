import { expect, test, type Page } from '@playwright/test';

// Auth is handled by the "setup auth" project; the chromium project loads
// the saved storage state so we are already logged in when these run.

const OPEN_SIDEBAR = /open sidebar/i;
const CLOSE_SIDEBAR = /close sidebar/i;

// The ✕ close button lives inside the sidebar <nav> (role="navigation").
// The full-screen backdrop is also an aria-labelled "Close sidebar" button,
// so scope to the nav to avoid a strict-mode multiple-match.
const navCloseButton = (page: Page) =>
  page.getByRole('navigation').getByRole('button', { name: CLOSE_SIDEBAR });

async function openSidebar(page: Page) {
  const btn = page.getByRole('button', { name: OPEN_SIDEBAR });
  await expect(btn).toBeVisible({ timeout: 10_000 });
  await btn.click();
  await expect(navCloseButton(page)).toBeVisible();
}

test.describe('sidebar sharing across pages', () => {
  // The sidebar is a root-level node rendered outside <Routes>, so its content
  // is shared on every page. It auto-closes on navigation (so the backdrop
  // never lingers), but re-opening on the new route shows the same nav links —
  // proving the content is shared, not re-declared per page.
  test('sidebar content is shared after navigating via a sidebar link', async ({
    page,
  }) => {
    await page.goto('/');
    await openSidebar(page);

    // All nav links are present on home
    await expect(page.getByRole('link', { name: '🏠 Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: '📐 Columns' })).toBeVisible();

    // Navigate to /columns via the sidebar link (React Router — no full reload)
    await page.getByRole('link', { name: '📐 Columns' }).click();
    await expect(page).toHaveURL(/\/columns/);

    // Sidebar auto-closes on navigation: the open button is back
    await expect(page.getByRole('button', { name: OPEN_SIDEBAR })).toBeVisible({
      timeout: 10_000,
    });

    // Re-open on the new route — the same shared nav links are present
    await openSidebar(page);
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
  // The sidebar renders a "📍 `<currentPath>`" indicator. Each full load and
  // each in-app navigation triggers a run_script carrying the pathname, so the
  // indicator reflects the active route.
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
    await expect(page.getByText('📍')).toContainText('/', { timeout: 10_000 });

    // Navigate to /charts via the sidebar link; the sidebar auto-closes.
    await page.getByRole('link', { name: '📊 Charts' }).click();
    await expect(page).toHaveURL(/\/charts/);

    // Re-open and confirm the indicator updated to the new route — proving the
    // executor re-ran with the new currentPath.
    await openSidebar(page);
    await expect(page.getByText('📍')).toContainText('/charts', {
      timeout: 10_000,
    });
  });
});
