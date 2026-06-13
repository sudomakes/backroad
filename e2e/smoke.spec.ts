import { expect, test, type Page } from '@playwright/test';

// The demo app's auth gate is active during e2e — playwright.config.ts
// sets BETTER_AUTH_SECRET on the webServer env so `buildAuth()` returns
// a live better-auth instance. This spec walks one user through the
// full journey:
//
//   1. Visit /        → gate shows "Log in"
//   2. Click Log in   → redirects to /auth/signin
//   3. /auth/signup   → create a fresh account (autoSignIn lands at /)
//   4. /              → gated content renders, "Hello, <name>" visible
//   5. Log out        → cookie cleared, browser at /auth/signin
//   6. Sign in again  → same credentials get back into the app
//
// All steps share ONE `page` so cookies survive between assertions.
//
// This spec runs under the `chromium` project which loads the shared
// auth state from the setup project. We create a *fresh* context here
// (without storageState) so the auth gate tests start cleanly logged
// out, while the signup/re-login steps manage cookies themselves.

test.describe.configure({ mode: 'serial' });

// Unique credentials per run. The demo uses an in-memory auth adapter
// that lives for the lifetime of the backend process (the whole e2e
// run), so reusing emails across reruns would collide.
const stamp = Date.now();
const user = {
  name: `E2E User ${stamp}`,
  email: `e2e+${stamp}@example.com`,
  password: 'CorrectHorse9Battery!Staple',
};

test.describe('auth flow', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
  });
  test.afterAll(async () => {
    await page.context()?.close();
  });

  test('home shows the login gate when logged out', async () => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^log in$/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Backroad LLM Example/i })
    ).toHaveCount(0);
  });

  test('clicking Log in redirects to /auth/signin', async () => {
    await page.goto('/');
    await page.getByRole('button', { name: /^log in$/i }).click();
    await expect(page).toHaveURL(/\/auth\/signin\b/);
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  });

  test('sign up creates an account and lands on the gated app', async () => {
    await page.goto('/auth/signup');
    await page.getByRole('textbox', { name: /^name$/i }).fill(user.name);
    await page.getByRole('textbox', { name: /^email$/i }).fill(user.email);
    await page
      .getByRole('textbox', { name: /^password$/i })
      .fill(user.password);
    await page.getByRole('button', { name: /create an account/i }).click();

    // autoSignIn=true in examples/demo/src/auth.ts; navigate() in
    // AuthRoute hard-reloads to / so the new socket connection picks
    // up the just-set cookie.
    await expect(page).toHaveURL(/^http:\/\/localhost:4200\/?$/, {
      timeout: 15_000,
    });
    await expect(
      page.getByRole('heading', { name: /Backroad LLM Example/i })
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(user.name)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^log out$/i })
    ).toBeVisible();
  });

  test('log out clears the session and returns to /auth/signin', async () => {
    await page.goto('/');
    await page.getByRole('button', { name: /^log out$/i }).click();
    await expect(page).toHaveURL(/\/auth\/signin\b/, { timeout: 10_000 });
    // Visiting / again must show the gate, not the app.
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^log in$/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Backroad LLM Example/i })
    ).toHaveCount(0);
  });

  test('sign in with the just-created credentials gets back into the app', async () => {
    await page.goto('/auth/signin');
    await page.getByRole('textbox', { name: /^email$/i }).fill(user.email);
    await page
      .getByRole('textbox', { name: /^password$/i })
      .fill(user.password);
    await page.getByRole('button', { name: /^login$/i }).click();

    await expect(page).toHaveURL(/^http:\/\/localhost:4200\/?$/, {
      timeout: 15_000,
    });
    await expect(
      page.getByRole('heading', { name: /Backroad LLM Example/i })
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(user.name)).toBeVisible();
  });
});
