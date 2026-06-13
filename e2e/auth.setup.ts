import { expect, test as setup } from '@playwright/test';

// One-time sign-up shared across all e2e specs that need an authenticated
// session.  The storage state is saved to a file that downstream projects
// reference via `storageState` in playwright.config.ts.
//
// The smoke spec tests auth *itself* (gate, signup, login, logout) so it
// does its own credential management — it does NOT use this setup.

const AUTH_FILE = 'e2e/.auth/user.json';

const stamp = Date.now();
const user = {
  name: `E2E User ${stamp}`,
  email: `e2e+${stamp}@example.com`,
  password: 'CorrectHorse9Battery!Staple',
};

setup('sign up and save storage state', async ({ page }) => {
  await page.goto('/auth/signup');
  await page.getByRole('textbox', { name: /^name$/i }).fill(user.name);
  await page.getByRole('textbox', { name: /^email$/i }).fill(user.email);
  await page.getByRole('textbox', { name: /^password$/i }).fill(user.password);
  await page.getByRole('button', { name: /create an account/i }).click();

  // autoSignIn=true lands on /
  await expect(page).toHaveURL(/^http:\/\/localhost:4200\/?$/, {
    timeout: 15_000,
  });
  await expect(
    page.getByRole('heading', { name: /Backroad LLM Example/i })
  ).toBeVisible({ timeout: 10_000 });

  // Persist the authenticated state for downstream projects
  await page.context().storageState({ path: AUTH_FILE });
});
