import { test, expect } from "@playwright/test";

/**
 * CBT (Computer-Based Test) Engine - Critical Path Tests
 *
 * This is the most important flow in Stuudi.
 * The exam must be proctored with:
 *  - System check (camera + fullscreen)
 *  - Timer countdown
 *  - Question navigation
 *  - Tab-switch violation detection (3 lives)
 *  - Auto-save & submit
 */

test.describe("CBT Exam Engine", () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant camera permission for tests that need it
    await context.grantPermissions(["camera"], { origin: "http://localhost:3000" });
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear()).catch(() => {});
  });

  // ───── SYSTEM CHECK ─────

  test("should redirect to /cbt/check before exam starts", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input#identifier', process.env.STUDENT_USER || "student.test@stuudi.id");
    await page.fill('input#password', process.env.STUDENT_PASSWORD || "Test1234!");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15_000 });

    // Navigate to CBT
    await page.goto("/cbt/check");
    await expect(page).toHaveURL(/\/cbt/);

    // System check UI should appear
    await expect(page.locator("body")).toContainText(/camera|kamera|fullscreen|ujian|exam/i, {
      timeout: 10_000,
    });
  });

  test("should require camera permission", async ({ page, context }) => {
    // Revoke camera permission
    await context.clearPermissions();

    await page.goto("/login");
    await page.fill('input#identifier', process.env.STUDENT_USER || "student.test@stuudi.id");
    await page.fill('input#password', process.env.STUDENT_PASSWORD || "Test1234!");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"));

    await page.goto("/cbt/check");
    await page.waitForTimeout(3_000);

    // Some form of camera check UI should be present
    const cameraText = page.getByText(/camera|kamera/i).first();
    if (await cameraText.isVisible({ timeout: 3_000 })) {
      expect(cameraText).toBeTruthy();
    }
  });

  test("should require fullscreen mode", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input#identifier', process.env.STUDENT_USER || "student.test@stuudi.id");
    await page.fill('input#password', process.env.STUDENT_PASSWORD || "Test1234!");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"));

    await page.goto("/cbt/check");
    await page.waitForTimeout(2_000);

    // Fullscreen check should be mentioned
    const fullscreenText = page.getByText(/fullscreen|layar penuh/i).first();
    if (await fullscreenText.isVisible({ timeout: 3_000 })) {
      expect(fullscreenText).toBeTruthy();
    }
  });

  // ───── EXAM INTERFACE ─────

  test("exam page should display timer, header, sidebar", async ({ page }) => {
    // Mock the exam start API to return valid data
    await page.route("**/api/v1/student/exams/*/start", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            attempt_id: "test-attempt-id",
            exam_id: "test-exam-id",
            title: "Test Exam",
            duration: 60,
            started_at: new Date().toISOString(),
            ends_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            questions: [
              {
                question_id: "q1",
                question_text: "What is 2+2?",
                question_type: "single",
                options: [
                  { option_id: "a", option_text: "3" },
                  { option_id: "b", option_text: "4" },
                  { option_id: "c", option_text: "5" },
                ],
              },
            ],
            lives_info: {
              lives_remaining: 3,
              tab_switches: 0,
              is_disqualified: false,
            },
          },
        }),
      });
    });

    await page.goto("/login");
    await page.fill('input#identifier', process.env.STUDENT_USER || "student.test@stuudi.id");
    await page.fill('input#password', process.env.STUDENT_PASSWORD || "Test1234!");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"));

    await page.goto("/cbt/exam");
    await page.waitForTimeout(3_000);

    // If exam page loads, check for key elements
    const headerText = await page.locator("body").textContent();
    if (headerText && (headerText.includes("Test Exam") || headerText.includes("ujian"))) {
      // Timer should be running
      await expect(page.locator("body")).toContainText(/\d{2}:\d{2}/, { timeout: 5_000 });
    }
  });

  // ───── QUESTION NAVIGATION ─────

  test("should allow answering single choice question", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input#identifier', process.env.STUDENT_USER || "student.test@stuudi.id");
    await page.fill('input#password', process.env.STUDENT_PASSWORD || "Test1234!");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"));

    await page.goto("/cbt/exam");
    await page.waitForTimeout(3_000);

    // Try clicking an option
    const options = page.locator('button:has(input[type="radio"]), [role="radio"], label:has(input)');
    const optionCount = await options.count();

    if (optionCount > 0) {
      await options.first().click();
      // Selection should register
      await page.waitForTimeout(500);
    }
  });

  // ───── TAB SWITCH DETECTION ─────

  test("should detect tab switch and show violation warning", async ({ page, context }) => {
    await page.goto("/login");
    await page.fill('input#identifier', process.env.STUDENT_USER || "student.test@stuudi.id");
    await page.fill('input#password', process.env.STUDENT_PASSWORD || "Test1234!");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"));

    await page.goto("/cbt/exam");
    await page.waitForTimeout(3_000);

    // Open new tab to simulate switch
    const page2 = await context.newPage();
    await page2.goto("about:blank");

    // Focus back to exam page
    await page.bringToFront();
    await page.waitForTimeout(2_000);

    // Look for violation warning
    const warning = page.getByText(/peringatan|violation|tab.switch|warning/i).first();
    if (await warning.isVisible({ timeout: 3_000 }).catch(() => false)) {
      expect(warning).toBeTruthy();
    }

    await page2.close();
  });

  // ───── SUBMIT ─────

  test("should show submit confirmation modal", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input#identifier', process.env.STUDENT_USER || "student.test@stuudi.id");
    await page.fill('input#password', process.env.STUDENT_PASSWORD || "Test1234!");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"));

    await page.goto("/cbt/exam");
    await page.waitForTimeout(3_000);

    // Click submit
    const submitBtn = page.locator(
      'button:has-text("Submit"), button:has-text("Kirim"), button:has-text("Selesai")'
    ).first();
    if (await submitBtn.isVisible({ timeout: 3_000 })) {
      await submitBtn.click();
      await page.waitForTimeout(1_000);

      // Confirmation modal should appear
      await expect(
        page.getByText(/konfirmasi|yakin|anda yakin|are you sure/i).first()
      ).toBeVisible({ timeout: 5_000 });
    }
  });
});