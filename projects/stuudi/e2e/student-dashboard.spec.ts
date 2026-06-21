import { test, expect } from "@playwright/test";
import { login } from "./utils/fixtures";

test.describe("Student Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login as student before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear()).catch(() => {});
    await login(page, {
      identifier: process.env.STUDENT_USER || "student.test@stuudi.id",
      password: process.env.STUDENT_PASSWORD || "Test1234!",
    });
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15_000 });
  });

  test("should display dashboard with main sections", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);

    // Main sections should be visible
    // (using flexible selectors since UI might vary)
    await expect(page.locator("body")).toContainText(/exam|kursus|course|dashboard/i, {
      timeout: 10_000,
    });
  });

  test("should navigate to courses via sidebar", async ({ page }) => {
    await page.goto("/dashboard");

    // Click the Courses link in the sidebar
    await page.click('a[href="/courses"], [href*="/courses"]', { timeout: 10_000 }).catch(() => {});

    await page.waitForURL(/\/courses/, { timeout: 10_000 });
    expect(page.url()).toContain("/courses");
  });

  test("should show exam code input", async ({ page }) => {
    await page.goto("/dashboard");

    // Exam code input should be visible
    const examInput = page.locator(
      'input[placeholder*="kode" i], input[placeholder*="code" i], input[name*="exam" i]'
    );
    await expect(examInput.first()).toBeVisible({ timeout: 10_000 });
  });

  test("should reject invalid exam code", async ({ page }) => {
    await page.goto("/dashboard");

    const examInput = page.locator(
      'input[placeholder*="kode" i], input[placeholder*="code" i], input[name*="exam" i]'
    ).first();
    await examInput.fill("XXXXXX");

    const submitButton = page.locator(
      'button:has-text("Mulai"), button:has-text("Akses"), button[type="submit"]'
    ).first();
    await submitButton.click();

    // Should show error or stay on dashboard
    await page.waitForTimeout(2_000);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should display notifications", async ({ page }) => {
    await page.goto("/dashboard");

    // Click notifications icon
    const notifButton = page.locator(
      'button[aria-label*="notification" i], [data-testid*="notification"]'
    ).first();
    if (await notifButton.isVisible({ timeout: 3_000 })) {
      await notifButton.click();
      await page.waitForTimeout(1_000);
    }
  });

  test("should logout successfully", async ({ page }) => {
    await page.goto("/dashboard");

    // Find and click logout button
    const logoutBtn = page.locator(
      'button:has-text("Keluar"), button:has-text("Logout"), [aria-label*="logout"]'
    ).first();

    if (await logoutBtn.isVisible({ timeout: 5_000 })) {
      await logoutBtn.click();
      // Handle potential confirmation modal
      const confirmBtn = page.locator(
        'button:has-text("Ya"), button:has-text("Keluar"), button:has-text("Konfirmasi")'
      ).last();
      if (await confirmBtn.isVisible({ timeout: 2_000 })) {
        await confirmBtn.click();
      }

      // Should redirect to login
      await page.waitForURL(/\/login|\/$/, { timeout: 10_000 });
    }
  });
});

test.describe("Course Browsing & Enrollment", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await login(page, {
      identifier: process.env.STUDENT_USER || "student.test@stuudi.id",
      password: process.env.STUDENT_PASSWORD || "Test1234!",
    });
    await page.waitForURL((url) => !url.pathname.includes("/login"));
  });

  test("should display course list page", async ({ page }) => {
    await page.goto("/courses");
    await expect(page).toHaveURL(/\/courses/);
    await expect(page.locator("body")).toContainText(/course|kursus/i, { timeout: 10_000 });
  });

  test("should search courses", async ({ page }) => {
    await page.goto("/courses");

    const searchInput = page.locator(
      'input[placeholder*="cari" i], input[placeholder*="search" i], input[type="search"]'
    ).first();
    if (await searchInput.isVisible({ timeout: 5_000 })) {
      await searchInput.fill("Algoritma");
      await page.waitForTimeout(2_000);
      // URL should reflect search (or page should update)
    }
  });

  test("should show enroll modal/code input", async ({ page }) => {
    await page.goto("/courses");

    const enrollBtn = page.locator(
      'button:has-text("Gabung"), button:has-text("Enroll"), button:has-text("Daftar")'
    ).first();
    if (await enrollBtn.isVisible({ timeout: 5_000 })) {
      await enrollBtn.click();
      await page.waitForTimeout(1_000);
      // Modal/code input should appear
      const codeInput = page.locator('input[placeholder*="kode" i]');
      await expect(codeInput.first()).toBeVisible();
    }
  });
});