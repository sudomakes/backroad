import { expect, test } from '@playwright/test';

// Runs under the `chromium` project (already authenticated via the saved
// storage state).
//
// Regression guard for focus survival across a rerun. The renderer used to key
// every component by its value, so any committed value change unmounted and
// remounted the widget — dropping DOM focus, the text caret, and selection
// mid-interaction. Components are now keyed by their stable `id` and sync the
// server value in place (useSyncedState), so the node survives a value change.
//
// The Volume slider is the sharpest probe: a keyboard nudge commits a new value
// and reruns the script. If that rerun remounts the slider, it loses focus and
// the NEXT arrow key goes nowhere. So we focus once and then drive every nudge
// through `page.keyboard` (which targets whatever is currently focused, and does
// NOT re-focus the element the way `locator.press` would — re-focusing would
// mask the very bug under test). Each subsequent increment landing proves focus
// was retained across the previous rerun.

test.describe('focus survives a rerun', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/widgets');
    await expect(page.getByRole('heading', { name: /^Widgets$/ })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('a slider keeps keyboard focus across each commit-driven rerun', async ({
    page,
  }) => {
    const slider = page.getByRole('slider', { name: 'Volume' });
    await expect(page.getByText('Volume is 30')).toBeVisible();

    await slider.focus();
    await expect(slider).toBeFocused();

    // First nudge: commit + rerun. Under the old value-keyed renderer the slider
    // remounts here and focus is lost.
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('Volume is 31')).toBeVisible({
      timeout: 10_000,
    });
    // The node must still be the focused one for the rest of the test to work.
    await expect(slider).toBeFocused();

    // These two only register if focus survived the reruns above — each waits
    // for the script echo, so the prior rerun has fully landed (and, under the
    // old behaviour, would already have remounted) before the next key.
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('Volume is 32')).toBeVisible({
      timeout: 10_000,
    });

    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('Volume is 33')).toBeVisible({
      timeout: 10_000,
    });

    await expect(slider).toBeFocused();
  });
});
