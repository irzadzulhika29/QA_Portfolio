import { test, expect } from "@playwright/test";
import { TEST_USERS, ROUTES } from "./utils/fixtures";

/**
 * Admin Dashboard & Course Management Tests
 */

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear()).catch(() => {});

    // Login as teacher
    await page.goto(ROUTES.login);
    await page.fill('input#identifier', TEST_USERS.teacher.identifier);
    await page.fill('input#password', TEST_USERS.teacher.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard-admin/, { timeout: 15_000 });
  });

  test("should display admin dashboard with stats cards", async ({ page }) => {
    await page.goto(ROUTES.adminDashboard);

    // Stats cards should be present
    await expect(page.locator("body")).toContainText(
      /peserta|participant|statistik|dashboard/i,
      { timeout: 10_000 }
    );
  });

  test("should show exam selector dropdown", async ({ page }) => {
    await page.goto(ROUTES.adminDashboard);

    // Exam selector dropdown should be visible
    const dropdown = page.locator(
      'select, [role="combobox"], button:has(svg[class*="chevron"]), [data-testid*="exam-select"]'
    ).first();
    await expect(dropdown).toBeVisible({ timeout: 10_000 });
  });

  test("should navigate to courses page", async ({ page }) => {
    await page.goto(ROUTES.adminDashboard);

    // Click courses link
    await page.click('a[href*="courses"]', { timeout: 5_000 }).catch(() => {});

    await page.waitForURL(/\/courses/, { timeout: 10_000 });
  });

  test("should navigate to participants page", async ({ page }) => {
    await page.goto(ROUTES.adminDashboard);

    await page.click('a[href*="participant"]', { timeout: 5_000 }).catch(() => {});

    await page.waitForURL(/\/participant/, { timeout: 10_000 });
  });
});

test.describe("Admin Course Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear()).catch(() => {});

    await page.goto(ROUTES.login);
    await page.fill('input#identifier', TEST_USERS.teacher.identifier);
    await page.fill('input#password', TEST_USERS.teacher.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard-admin/);
  });

  test("should display course list", async ({ page }) => {
    await page.goto("/dashboard-admin/courses");
    await expect(page.locator("body")).toContainText(/course|kursus/i, { timeout: 10_000 });
  });

  test("should show create course form", async ({ page }) => {
    await page.goto("/dashboard-admin/courses/create");

    // Form fields should be present
    await expect(page.locator('input[name*="name" i], input[placeholder*="nama" i]').first()).toBeVisible(
      { timeout: 10_000 }
    );
  });

  test("should validate required fields when creating course", async ({ page }) => {
    await page.goto("/dashboard-admin/courses/create");

    // Click submit without filling fields
    const submitBtn = page.locator('button[type="submit"], button:has-text("Simpan"), button:has-text("Buat")');
    if (await submitBtn.first().isVisible({ timeout: 5_000 })) {
      await submitBtn.first().click();
      await page.waitForTimeout(1_000);

      // Validation errors should appear
      await expect(
        page.getByText(/wajib|required|tidak boleh kosong/i).first()
      ).toBeVisible({ timeout: 5_000 });
    }
  });

  test("should display participant management page", async ({ page }) => {
    await page.goto("/dashboard-admin/participant");

    // CSV upload or participant list should be visible
    await expect(page.locator("body")).toContainText(/participant|peserta|csv/i, {
      timeout: 10_000,
    });
  });

  test("should show CSV upload button", async ({ page }) => {
    await page.goto("/dashboard-admin/participant");

    const uploadBtn = page.locator(
      'button:has-text("Upload"), input[type="file"], label:has-text("Upload")'
    ).first();
    await expect(uploadBtn).toBeVisible({ timeout: 10_000 });
  });
});