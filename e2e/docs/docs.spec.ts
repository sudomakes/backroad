import { expect, test } from '@playwright/test';

// Docs e2e tests run under their own playwright config
// (e2e/docs/playwright.config.ts) with baseURL = http://localhost:3001.

test.describe('docs site', () => {
  test('home page renders the hero + nav links', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Backroad', level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /get started/i })
    ).toBeVisible();
  });

  test('getting-started page renders an install snippet', async ({ page }) => {
    await page.goto('/docs/getting-started');
    await expect(
      page.getByRole('heading', { name: /Getting started/i })
    ).toBeVisible();
    // The install snippet is in a <code> block.
    await expect(
      page.locator('code', { hasText: '@backroad/backroad' }).first()
    ).toBeVisible();
  });

  test('auth page is reachable and mentions better-auth', async ({ page }) => {
    await page.goto('/docs/auth');
    await expect(
      page.getByRole('heading', { name: /Authentication/i })
    ).toBeVisible();
    await expect(page.getByText(/better-auth/i).first()).toBeVisible();
  });

  test('sidebar exposes the key categories', async ({ page }) => {
    await page.goto('/docs/intro');
    // Docusaurus renders the sidebar as a <nav>; categories show as
    // buttons or links containing the label text.
    await expect(page.getByText('Fundamentals').first()).toBeVisible();
    await expect(page.getByText('Components').first()).toBeVisible();
    await expect(page.getByText('Configuration').first()).toBeVisible();
  });

  test('Copy as markdown button is present on doc pages', async ({ page }) => {
    await page.goto('/docs/intro');
    await expect(
      page.getByRole('button', { name: /copy as markdown/i })
    ).toBeVisible();
  });

  test('llms.txt is served under the docs baseUrl', async ({ request }) => {
    const res = await request.get('/docs/llms.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('# Backroad');
    expect(body).toContain('## docs');
    expect(body).toMatch(/intro\.md/);
  });

  test('per-page raw markdown is served (Copy as markdown source)', async ({
    request,
  }) => {
    const res = await request.get('/docs/intro.md');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/Backroad/);
  });

  test.describe('search', () => {
    test('search input is present in the navbar', async ({ page }) => {
      await page.goto('/docs/intro');
      // docusaurus-lunr-search renders a search input in the navbar
      await expect(
        page
          .locator(
            'input[placeholder*="Search"], input[aria-label*="Search"], .search-input input'
          )
          .first()
      ).toBeVisible();
    });

    test('typing in search shows matching results', async ({ page }) => {
      await page.goto('/docs/intro');
      const searchInput = page
        .locator(
          'input[placeholder*="Search"], input[aria-label*="Search"], .search-input input'
        )
        .first();
      await searchInput.click();
      await searchInput.fill('sidebar');
      // Wait for results to appear — lunr search renders section headers
      await expect(page.getByText('COMPONENTS').first()).toBeVisible({
        timeout: 10_000,
      });
    });

    test('search result links to the correct page', async ({ page }) => {
      await page.goto('/docs/intro');
      const searchInput = page
        .locator(
          'input[placeholder*="Search"], input[aria-label*="Search"], .search-input input'
        )
        .first();
      await searchInput.click();
      await searchInput.fill('authentication');
      // The results dropdown shows section headers; click the "Authentication" link
      const authResult = page
        .getByRole('link', { name: 'Authentication' })
        .first();
      await expect(authResult).toBeVisible({ timeout: 10_000 });
      await authResult.click();
      await expect(page).toHaveURL(/auth/);
      await expect(
        page.getByRole('heading', { name: /Authentication/i })
      ).toBeVisible();
    });
  });

  test.describe('live sandbox (WebContainer)', () => {
    test('try-it page shows the Run CTA', async ({ page }) => {
      await page.goto('/docs/try-it');
      await expect(
        page.getByRole('heading', { name: /Try Backroad live/i })
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /run the example/i })
      ).toBeVisible();
    });

    test('clicking Run mounts the editor textarea', async ({ page }) => {
      await page.goto('/docs/try-it');
      await page.getByRole('button', { name: /run the example/i }).click();
      // The WebContainer sandbox shows a native <textarea> for editing
      // the app.ts source. It's rendered immediately on click.
      await expect(page.locator('textarea[spellcheck="false"]')).toBeVisible({
        timeout: 10_000,
      });
      // The starting source code should be present in the textarea.
      await expect(page.getByText(/import { run } from/i).first()).toBeVisible({
        timeout: 10_000,
      });
    });
  });
});
