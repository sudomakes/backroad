# Plan: Playwright E2E

Branch: alpha
Status: READY TO IMPLEMENT
PR: feat/playwright-e2e

---

## Goal

Wire up all existing example app component pages as named routes, add Playwright E2E tests for each, and make the suite pass in CI.

---

## Context: What already exists

`apps/backroad-example/src/pages/` already has pages for ALL components:

- `charts.ts`, `columns.ts`, `fileUpload.ts`, `form.ts`, `llm.ts`, `markdown.ts`, `select.ts`, `stats.ts`

But `main.ts` only registers `/file-upload` and an unnamed `/page-2`. The rest of the component pages are imported but never wired to routes. The fix is registering them.

---

## Step 1: Register all component pages as routes in main.ts

```ts
// apps/backroad-example/src/main.ts
run(
  (br) => {
    pages.fileUpload(br.page({ path: '/file-upload' }));
    pages.form(br.page({ path: '/form' }));
    pages.markdown(br.page({ path: '/markdown' }));
    pages.select(br.page({ path: '/select' }));
    pages.stats(br.page({ path: '/stats' }));
    pages.columns(br.page({ path: '/columns' }));
    pages.charts(br.page({ path: '/charts' }));
    pages.llm(br.page({ path: '/llm' }));

    // default page (existing LLM example)
    br.write({ body: `# Backroad Example App` });
    // ...existing default page content
  },
  {
    /* existing config */
  }
);
```

---

## Step 2: Install Playwright

```bash
pnpm add -D @playwright/test --filter backroad-example
# OR at root level if e2e/ is root-level:
pnpm add -D @playwright/test -w
```

---

## Step 3: playwright.config.ts (root level)

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: { baseURL: 'http://localhost:3333' },
  webServer: {
    command: 'pnpm --filter backroad-example run dev',
    url: 'http://localhost:3333',
    reuseExistingServer: !process.env.CI,
    timeout: 60000, // give ts-node time to compile
  },
  projects: [
    { name: 'setup', testMatch: /global\.setup\.ts/ },
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
      dependencies: ['setup'],
    },
  ],
});
```

Note: port 3333 is the default in `runner/index.ts`.

---

## Step 4: e2e/ directory structure

```
e2e/
  global.setup.ts          # wait for server to be healthy
  websocket.spec.ts        # WS connects, receives backroad_config
  routing.spec.ts          # navigate between pages
  components/
    button.spec.ts
    markdown.spec.ts
    form.spec.ts
    select.spec.ts
    file-upload.spec.ts
    stats.spec.ts
    charts.spec.ts
    columns.spec.ts
    llm.spec.ts
```

---

## Step 5: What each spec tests

### websocket.spec.ts

```ts
test('WS connects and receives backroad_config', async ({ page }) => {
  await page.goto('/');
  // listen for WS upgrade
  const ws = await page.waitForEvent('websocket');
  expect(ws.url()).toContain('/api/socket.io');
  // wait for a frame from server (backroad_config)
  const frame = await ws.waitForEvent('framereceived');
  expect(frame.payload).toContain('backroad_config');
});
```

### routing.spec.ts

```ts
test('navigates to /form page', async ({ page }) => {
  await page.goto('/form');
  await expect(page.locator('body')).not.toBeEmpty();
  // assert a form element is present
});
```

### components/button.spec.ts

```ts
test('button click triggers state update and re-render', async ({ page }) => {
  await page.goto('/'); // default page has Reset button
  const button = page.getByRole('button', { name: 'Reset' });
  await expect(button).toBeVisible();
  await button.click();
  // assert no error state
});
```

### components/form.spec.ts

```ts
test('toggle renders conditional content', async ({ page }) => {
  await page.goto('/form');
  const toggle = page.getByLabel('Print the selected value');
  await toggle.click();
  await expect(page.getByText(/Selected color is/)).toBeVisible();
});
```

### components/stats.spec.ts

```ts
test('stats page renders metric values', async ({ page }) => {
  await page.goto('/stats');
  // assert stat labels/values are present
  await expect(page.locator('[data-testid="stat"]').first()).toBeVisible();
});
```

### components/charts.spec.ts

```ts
test('charts page renders canvas element', async ({ page }) => {
  await page.goto('/charts');
  await expect(page.locator('canvas')).toBeVisible();
});
```

### components/file-upload.spec.ts

```ts
test('file upload input is present', async ({ page }) => {
  await page.goto('/file-upload');
  await expect(page.locator('input[type="file"]')).toBeVisible();
});
```

---

## Step 6: CI job in .github/workflows/release.yml

Add a new job after the existing `main` job:

```yaml
e2e:
  runs-on: ubuntu-latest
  needs: main # run after lint/test/build pass
  steps:
    - uses: actions/checkout@v2
      with: { fetch-depth: 0 }
    - uses: pnpm/action-setup@v4
      with: { version: 10.27.0, run_install: false }
    - uses: actions/setup-node@v4
      with: { node-version: 20, cache: pnpm }
    - run: pnpm install --frozen-lockfile
    - run: pnpm exec playwright install --with-deps chromium
    - run: pnpm exec playwright test
      env: { CI: true }
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

Upload the Playwright HTML report on failure so you can see what broke in CI.

---

## Files touched

| File                                | Change                                     |
| ----------------------------------- | ------------------------------------------ |
| `apps/backroad-example/src/main.ts` | Register all component pages as routes     |
| `playwright.config.ts`              | New — root-level Playwright config         |
| `e2e/global.setup.ts`               | New                                        |
| `e2e/websocket.spec.ts`             | New                                        |
| `e2e/routing.spec.ts`               | New                                        |
| `e2e/components/*.spec.ts`          | New (9 files)                              |
| `.github/workflows/release.yml`     | Add `e2e` job                              |
| `package.json`                      | Add `"test:e2e": "playwright test"` script |

Total: ~14 files, all additive except `main.ts` and `release.yml`.

---

## Success criteria

- `pnpm exec playwright test` passes locally
- All 9 component pages have at least one passing E2E test
- CI `e2e` job passes on `alpha` branch push
- Playwright HTML report uploaded as artifact on failure
