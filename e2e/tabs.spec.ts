import { expect, test } from '@playwright/test';

// Runs under the `chromium` project (already authenticated via the saved
// storage state). The /tabs demo page is a 2-tab layout whose SECOND tab owns
// a text_input. Committing that input reruns the script server-side, which
// patches the whole tree back into the client. This spec pins the behaviour
// that selection survives that patch: the active tab is uncontrolled Radix
// state on a stable-keyed component, so a rerun triggered from within tab 2
// must leave the user on tab 2 — not snap them back to tab 1.

test.describe('tabs survive a rerun', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs');
    await expect(page.getByRole('heading', { name: /^Tabs$/ })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('a rerun ordered from inside tab 2 keeps tab 2 active', async ({
    page,
  }) => {
    const firstTab = page.getByRole('tab', { name: 'First tab' });
    const secondTab = page.getByRole('tab', { name: 'Second tab' });

    // First tab is the default selection.
    await expect(firstTab).toHaveAttribute('data-state', 'active');
    await expect(secondTab).toHaveAttribute('data-state', 'inactive');

    // Switch to tab 2 and confirm its content (incl. the input) mounted.
    await secondTab.click();
    await expect(secondTab).toHaveAttribute('data-state', 'active');
    const nameInput = page.getByLabel('Your name');
    await expect(nameInput).toBeVisible();
    await expect(page.getByText('Hello, stranger!')).toBeVisible();

    // Commit a value from inside tab 2 — this is what orders the rerun.
    // text_input commits on blur/Enter, not per keystroke.
    await nameInput.fill('Ada');
    await nameInput.press('Enter');

    // The echo updates only after the script reruns and re-renders, so seeing
    // it proves the rerun landed.
    await expect(page.getByText('Hello, Ada!')).toBeVisible({
      timeout: 10_000,
    });

    // The whole point: the rerun must not have bounced us back to tab 1.
    await expect(secondTab).toHaveAttribute('data-state', 'active');
    await expect(firstTab).toHaveAttribute('data-state', 'inactive');
    // Radix unmounts inactive tab content, so the input staying visible is an
    // independent confirmation that tab 2 is still the one on screen.
    await expect(nameInput).toBeVisible();
  });
});
