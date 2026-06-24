import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Config for IFL Chapter Malang
 * Website: https://iflchaptermalang.org (FE)
 * API: https://api.iflchaptermalang.org/api/v1 (BE Laravel)
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["html", { outputFolder: "playwright-report" }], ["github"]]
    : "list",

  use: {
    baseURL: "https://iflchaptermalang.org", // ganti ke localhost kalo development
    apiBaseURL: "https://api.iflchaptermalang.org/api/v1",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
});
