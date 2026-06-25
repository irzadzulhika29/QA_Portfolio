import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Config for Akademi Competition
 * Website: https://akademicompetition.id (production)
 * API: {{vps}}/... (set via env or variable)
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
    baseURL: process.env.BASE_URL || "https://akademicompetition.id",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
