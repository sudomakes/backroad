import { expect, test } from '@playwright/test';

// Runs under the `chromium` project (already authenticated via the saved
// storage state). The /widgets demo page renders a download_button that emits a
// JSON file and echoes a confirmation back into the page, so we verify both the
// real browser download and the server round-trip (click → script reruns → echo).

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

  test('downloads the file and echoes the round-trip on click', async ({
    page,
  }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Report' }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('backroad-report.json');

    // The click also commits value true, so the server reruns and renders the
    // confirmation echo.
    await expect(page.getByText('Report downloaded!')).toBeVisible({
      timeout: 10_000,
    });
  });
});
