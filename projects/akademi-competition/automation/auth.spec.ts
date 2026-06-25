import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Auth pages load correctly", () => {
    test("Login page loads with all form elements", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      // Page title
      await expect.soft(page).toHaveTitle(/Akademi Competition/);

      // Form heading
      await expect.soft(page.locator("h1")).toContainText("Selamat Datang");

      // Email / identifier field
      const emailInput = page.locator("#identifier");
      await expect.soft(emailInput).toBeVisible();
      await expect.soft(emailInput).toHaveAttribute("type", "text");
      await expect.soft(emailInput).toHaveAttribute("placeholder", /nama@email.com|username/);

      // Password field
      const passwordInput = page.locator("#password");
      await expect.soft(passwordInput).toBeVisible();
      await expect.soft(passwordInput).toHaveAttribute("type", "password");
      await expect.soft(passwordInput).toHaveAttribute("placeholder", /Masukkan password/);

      // Submit button
      const submitBtn = page.locator('button[type="submit"]');
      await expect.soft(submitBtn).toBeVisible();
      await expect.soft(submitBtn).toContainText("Masuk");

      // Google OAuth button
      const googleBtn = page.locator("button", { hasText: "Masuk dengan Google" });
      await expect.soft(googleBtn).toBeVisible();

      // Register link
      const registerLink = page.locator('a[href="/register"]');
      await expect.soft(registerLink).toBeVisible();
      await expect.soft(registerLink).toContainText("Daftar di sini");
    });

    test("Register page loads with form elements", async ({ page }) => {
      await page.goto("/register");
      await page.waitForLoadState("networkidle");

      // Page title
      await expect.soft(page).toHaveTitle(/Akademi Competition/);

      // Form heading
      await expect.soft(page.locator("h1")).toContainText("Daftar");

      // Step indicator
      const stepIndicator = page.locator("text=Langkah 1 dari 4");
      await expect.soft(stepIndicator).toBeVisible();

      // Email field
      const emailInput = page.locator("#email");
      await expect.soft(emailInput).toBeVisible();
      await expect.soft(emailInput).toHaveAttribute("type", "email");
      await expect.soft(emailInput).toHaveAttribute("placeholder", "nama@email.com");

      // Submit button
      const submitBtn = page.locator('button[type="submit"]');
      await expect.soft(submitBtn).toBeVisible();
      await expect.soft(submitBtn).toContainText("Lanjutkan");

      // Google OAuth button
      const googleBtn = page.locator("button", { hasText: "Daftar dengan Google" });
      await expect.soft(googleBtn).toBeVisible();

      // Login link
      const loginLink = page.locator('a[href="/login"]');
      await expect.soft(loginLink).toBeVisible();
      await expect.soft(loginLink).toContainText("Masuk di sini");
    });

    test("Forgot password link is visible on login page", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      // Forgot password button
      const forgotPasswordBtn = page.locator("button", { hasText: "Lupa Password?" });
      await expect.soft(forgotPasswordBtn).toBeVisible();
    });
  });

  test.describe("Login form validation", () => {
    test("shows validation errors when submitting with empty fields", async ({ page }) => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      // Click submit with empty fields
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();

      // Wait for validation to trigger — SweetAlert appears
      await expect.soft(page.locator("text=Data Tidak Lengkap")).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Protected route redirects (unauthenticated)", () => {
    test.beforeEach(async ({ page }) => {
      // Ensure no auth token exists
      await page.evaluate(() => localStorage.removeItem("token"));
      await page.evaluate(() => localStorage.removeItem("user"));
    });

    test("accessing /user/home without auth redirects to /", async ({ page }) => {
      await page.goto("/user/home");
      await page.waitForLoadState("networkidle");

      // RequireAuth redirects to PATHS.HOME (/)
      const currentUrl = page.url();
      await expect.soft(currentUrl).toMatch(/\/$/);
    });

    test("accessing /create-article without auth redirects to /", async ({ page }) => {
      await page.goto("/create-article");
      await page.waitForLoadState("networkidle");

      // RequireAuth redirects to PATHS.HOME (/)
      const currentUrl = page.url();
      await expect.soft(currentUrl).toMatch(/\/$/);
    });

    test("accessing /team-builder without auth redirects to /login", async ({ page }) => {
      await page.goto("/team-builder");
      await page.waitForLoadState("networkidle");

      // TeamBuilder component internally checks isLoggedIn() and redirects to /login
      const currentUrl = page.url();
      await expect.soft(currentUrl).toContain("/login");
    });
  });

  test.describe("Auth route accessibility", () => {
    test("auth pages are accessible without authentication", async ({ page }) => {
      // All auth pages should load without requiring login
      const authPages = [
        "/login",
        "/register",
        "/register/verify-otp",
        "/register/data-diri",
        "/register/data-diri-2",
        "/register/data-diri-3",
        "/register/data-diri-4",
      ];

      for (const path of authPages) {
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        // Should not redirect to login (already there)
        await expect.soft(page).toHaveURL(new RegExp(path.replace(/[-/]/g, "\\$&")));
      }
    });
  });
});
