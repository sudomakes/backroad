import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

// Runs under the `chromium` project (already authenticated via the saved
// storage state). The /widgets demo page renders a download_button that emits a
// JSON file, so we verify the real browser download end-to-end: the suggested
// filename and the actual file contents written to disk.

test.describe('download_button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widgets');
    await expect(page.getByRole('heading', { name: /^Widgets$/ })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('renders with the provided label', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Download Report' })
    ).toBeVisible();
  });

  test('downloads the file with the expected contents on click', async ({
    page,
  }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Report' }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('backroad-report.json');

    // Verify the actual bytes that hit the disk rather than the in-page echo,
    // which is unset on the very next rerun and only flashes momentarily.
    const path = await download.path();
    const contents = await readFile(path, 'utf-8');
    expect(JSON.parse(contents)).toEqual({ status: 'ok' });
  });
});
