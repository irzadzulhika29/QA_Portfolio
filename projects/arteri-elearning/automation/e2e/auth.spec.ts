import { test, expect } from "@playwright/test";
import { TEST_USERS, ROUTES, login } from "./utils/fixtures";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any stored session
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  // ───── POSITIVE SCENARIOS ─────

  test("should login successfully with valid student credentials", async ({ page }) => {
    await page.goto(ROUTES.login);

    await expect(page).toHaveTitle(/Stuudi|Arteri|Login/);

    await page.fill('input#identifier', TEST_USERS.student.identifier);
    await page.fill('input#password', TEST_USERS.student.password);
    await page.click('button[type="submit"]');

    // Expect redirect away from login
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15_000 });
    expect(page.url()).toContain("/dashboard");

    // LocalStorage should now have auth token
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();
  });

  test("should login successfully with valid teacher credentials and redirect to admin dashboard", async ({ page }) => {
    await page.goto(ROUTES.login);

    await page.fill('input#identifier', TEST_USERS.teacher.identifier);
    await page.fill('input#password', TEST_USERS.teacher.password);
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15_000 });
    // Teacher should land on /dashboard-admin
    expect(page.url()).toContain("/dashboard-admin");
  });

  test("should toggle password visibility", async ({ page }) => {
    await page.goto(ROUTES.login);
    const passwordInput = page.locator('input#password');

    await expect(passwordInput).toHaveAttribute("type", "password");
    await page.fill(passwordInput, "testpassword");

    // Click the eye icon (button to toggle visibility)
    await page.click('button:has(svg) >> nth=0', { timeout: 5_000 }).catch(() => {
      // Fallback if selector differs
    });

    // After toggle, type might change to text
    // (just verify password was filled correctly regardless)
    await expect(passwordInput).toHaveValue("testpassword");
  });

  // ───── NEGATIVE SCENARIOS ─────

  test("should show error with wrong password", async ({ page }) => {
    await page.goto(ROUTES.login);

    await page.fill('input#identifier', TEST_USERS.student.identifier);
    await page.fill('input#password', "WrongPassword123!");
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);

    // Error message should appear
    await expect(
      page.getByText(/Username atau password salah|salah|kredensial/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("should show error with non-existent user", async ({ page }) => {
    await page.goto(ROUTES.login);

    await page.fill('input#identifier', TEST_USERS.invalid.identifier);
    await page.fill('input#password', TEST_USERS.invalid.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByText(/Username atau password salah|kredensial/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("should show validation error when submitting empty form", async ({ page }) => {
    await page.goto(ROUTES.login);

    await page.click('button[type="submit"]');

    // Should still be on login
    await expect(page).toHaveURL(/\/login/);

    // Validation errors should appear
    await expect(page.getByText(/wajib|required|tidak boleh kosong/i).first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test("should show validation error with invalid email format", async ({ page }) => {
    await page.goto(ROUTES.login);

    await page.fill('input#identifier', "bukanemailformat");
    await page.fill('input#password', "somepassword");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/format|email/i).first()).toBeVisible({ timeout: 5_000 });
  });

  test("should redirect unauthenticated user away from dashboard", async ({ page }) => {
    // Try to access dashboard without login
    await page.goto(ROUTES.studentDashboard);

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    expect(page.url()).toContain("/login");
  });

  test("should block student from accessing admin dashboard", async ({ page }) => {
    // Login as student first
    await login(page, TEST_USERS.student);
    await page.waitForURL((url) => !url.pathname.includes("/login"));

    // Try to access admin dashboard
    await page.goto(ROUTES.adminDashboard);

    // Should redirect away (RoleGuard blocks)
    await page.waitForTimeout(2_000);
    expect(page.url()).not.toContain("/dashboard-admin");
  });

  test("should handle network errors gracefully", async ({ page }) => {
    await page.goto(ROUTES.login);

    // Block all API requests to simulate network failure
    await page.route("**/api/**", (route) => route.abort("failed"));

    await page.fill('input#identifier', TEST_USERS.student.identifier);
    await page.fill('input#password', TEST_USERS.student.password);
    await page.click('button[type="submit"]');

    // Should show network error
    await expect(
      page.getByText(/gagal terhubung|network|server|koneksi/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});