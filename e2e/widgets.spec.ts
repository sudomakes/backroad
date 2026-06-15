import { expect, test } from '@playwright/test';

// Runs under the `chromium` project (already authenticated via the saved
// storage state). The /widgets demo page echoes each widget's value back into
// the page, so every assertion verifies the full round-trip: interact → script
// reruns server-side → the bound value updates → the echo re-renders.

test.describe('widgets page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widgets');
    await expect(
      page.getByRole('heading', { name: /^Widgets$/ })
    ).toBeVisible({ timeout: 10_000 });
  });

  test('text area commits its value on blur', async ({ page }) => {
    const bio = page.getByLabel('Bio');
    await bio.fill('hello world');
    // Commits on blur, not per keystroke.
    await bio.blur();
    await expect(page.getByText('Bio length: 11')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('slider commits the new value on a keyboard nudge', async ({ page }) => {
    await expect(page.getByText('Volume is 30')).toBeVisible();
    const slider = page.getByRole('slider', { name: 'Volume' });
    await slider.focus();
    // Radix increments by `step` (1) and fires onValueCommit on key release.
    await slider.press('ArrowRight');
    await expect(page.getByText('Volume is 31')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('date and time inputs commit on change', async ({ page }) => {
    await page.getByLabel('Start date').fill('2026-12-25');
    await expect(page.getByText('Date: 2026-12-25')).toBeVisible({
      timeout: 10_000,
    });

    await page.getByLabel('Reminder at').fill('14:30');
    await expect(page.getByText('Time: 14:30')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('toast fires into the app-root Toaster on button click', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Notify' }).click();
    await expect(page.getByText('Saved your preferences!')).toBeVisible({
      timeout: 10_000,
    });
  });
});
