import { expect, test } from '@playwright/test';

// The docs site runs on http://localhost:3001 (separate from the main
// frontend on :4200). Tests target it via a fully-qualified URL so we
// don't have to reconfigure baseURL per-spec.
const DOCS = 'http://localhost:3001';

test.describe('docs site', () => {
  test('home page renders the hero + nav links', async ({ page }) => {
    await page.goto(`${DOCS}/`);
    await expect(
      page.getByRole('heading', { name: 'Backroad', level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /get started/i })
    ).toBeVisible();
  });

  test('getting-started page renders an install snippet', async ({ page }) => {
    await page.goto(`${DOCS}/docs/getting-started`);
    await expect(
      page.getByRole('heading', { name: /Getting started/i })
    ).toBeVisible();
    // The install snippet is in a <code> block.
    await expect(
      page.locator('code', { hasText: '@backroad/backroad' }).first()
    ).toBeVisible();
  });

  test('auth page is reachable and mentions better-auth', async ({ page }) => {
    await page.goto(`${DOCS}/docs/auth`);
    await expect(
      page.getByRole('heading', { name: /Authentication/i })
    ).toBeVisible();
    await expect(page.getByText(/better-auth/i).first()).toBeVisible();
  });

  test('sidebar exposes the key categories', async ({ page }) => {
    await page.goto(`${DOCS}/docs/intro`);
    // Docusaurus renders the sidebar as a <nav>; categories show as
    // buttons or links containing the label text.
    await expect(page.getByText('Fundamentals').first()).toBeVisible();
    await expect(page.getByText('Components').first()).toBeVisible();
    await expect(page.getByText('Configuration').first()).toBeVisible();
  });

  test('Copy as markdown button is present on doc pages', async ({ page }) => {
    await page.goto(`${DOCS}/docs/intro`);
    await expect(
      page.getByRole('button', { name: /copy as markdown/i })
    ).toBeVisible();
  });

  test('llms.txt is served under the docs baseUrl', async ({ request }) => {
    const res = await request.get(`${DOCS}/docs/llms.txt`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('# Backroad');
    expect(body).toContain('## docs');
    expect(body).toMatch(/intro\.md/);
  });

  test('per-page raw markdown is served (Copy as markdown source)', async ({
    request,
  }) => {
    const res = await request.get(`${DOCS}/docs/intro.md`);
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/Backroad/);
  });

  // Sandpack lazy-loads on click — verifying the page renders the CTA
  // and that clicking it actually mounts the editor. We do NOT wait for
  // the WebContainer to boot the Backroad server (that's ~30s and
  // brittle for CI); we only assert the editor surface appears.
  test.describe('live sandbox', () => {
    test('try-it page shows the Run CTA', async ({ page }) => {
      await page.goto(`${DOCS}/docs/try-it`);
      await expect(
        page.getByRole('heading', { name: /Try Backroad live/i })
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: /run the example/i })
      ).toBeVisible();
    });

    test('clicking Run mounts the Sandpack editor', async ({ page }) => {
      await page.goto(`${DOCS}/docs/try-it`);
      await page.getByRole('button', { name: /run the example/i }).click();
      // Sandpack's CodeEditor uses CodeMirror. Wait for the textarea
      // (CodeMirror's a11y input) to appear — that's the first DOM
      // signal the editor is mounted.
      await expect(
        page.locator('.cm-editor, .sp-editor textarea').first()
      ).toBeVisible({ timeout: 20_000 });
      // The user's `app.ts` content should be in the editor.
      await expect(page.getByText(/import { run } from/i).first()).toBeVisible({
        timeout: 10_000,
      });
    });
  });
});
