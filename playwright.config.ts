import { randomBytes } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:4200/';
const BACKEND_URL = 'http://localhost:3333/';

// One ephemeral secret per `pnpm e2e` run — keeps the in-memory
// better-auth instance happy and ensures the auth gate is active so
// the auth e2e specs actually exercise the gated flow.
const BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET ?? randomBytes(32).toString('base64');

export default defineConfig({
  testDir: './e2e',
  // `.spec.ts` is the e2e convention; unit tests use `.test.ts` and live
  // co-located in libs/<pkg>/src — vitest picks those up separately.
  testMatch: ['**/*.spec.ts', '**/*.setup.ts'],
  testIgnore: ['e2e/docs/**'],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: FRONTEND_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  // Backend (express + socket.io) on 3333; Vite frontend on 4200 with
  // /api proxied to 3333. Tests hit the frontend.
  webServer: [
    {
      command: 'pnpm --filter @backroad-examples/demo run dev',
      url: `${BACKEND_URL}api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: FRONTEND_URL.replace(/\/$/, ''),
      },
    },
    {
      command: 'pnpm --filter backroad-frontend run dev',
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
  projects: [
    {
      name: 'setup auth',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup auth'],
    },
  ],
});
