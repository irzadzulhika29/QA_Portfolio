import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Stuudi (Arteri) E2E tests
 *
 * Run commands:
 *   npm run test:e2e           - run all tests
 *   npm run test:e2e:ui        - interactive UI mode
 *   npm run test:e2e:debug     - debug mode
 *   npm run test:e2e:headed    - see browser
 *   npm run test:e2e:auth      - auth tests only
 *   npm run test:e2e:cbt       - CBT (exam) tests only
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["json", { outputFile: "playwright-report/results.json" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});