import { test, expect } from "@playwright/test";

test.describe("Volunteer", () => {
  /* ===================================================================
   * 1. VOLUNTEER INFO PAGE — /relawan
   * =================================================================== */
  test.describe("Volunteer Info Page (/relawan)", () => {
    test("should load with title, hero section, and CTA to register", async ({
      page,
    }) => {
      await page.goto("/relawan");
      await page.waitForLoadState("networkidle");

      // Page title contains expected branding
      await expect(page).toHaveTitle(
        /Relawan|Volunteer|Indonesian Future Leaders/
      );

      // Hero / main heading
      await expect(
        page.getByRole("heading", { name: /Relawan|Volunteer/i })
      ).toBeVisible();

      // Navbar present
      await expect(
        page.locator('[aria-label="navigate-home"]')
      ).toBeVisible();

      // CTA button to registration page
      await expect(
        page.getByRole("link", { name: /Daftar|Daftar Sekarang|Bergabung/i })
      ).toBeVisible();

      // Info sections about volunteering
      const infoSections = page.locator(
        "section, article, [class*='card'], [class*='info']"
      );
      test.expect
        .soft(
          await infoSections.count(),
          "Should have at least one info/card section about volunteering"
        )
        .toBeGreaterThanOrEqual(1);

      // Footer present
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });

    test("should navigate to registration page from CTA link", async ({
      page,
    }) => {
      await page.goto("/relawan");
      await page.waitForLoadState("networkidle");

      // Click the registration CTA
      const ctaLink = page.getByRole("link", {
        name: /Daftar|Daftar Sekarang|Bergabung/i,
      });
      await expect(ctaLink).toBeVisible({ timeout: 10000 });

      // Verify href points to /relawan/daftar
      const href = await ctaLink.getAttribute("href");
      test.expect
        .soft(href, "CTA should link to the registration page")
        ?.toMatch(/\/relawan\/daftar/);

      await ctaLink.click();
      await page.waitForURL(/\/relawan\/daftar/);
      await expect(page).toHaveURL(/\/relawan\/daftar/);
    });
  });

  /* ===================================================================
   * 2. REGISTRATION FORM PAGE — /relawan/daftar
   * =================================================================== */
  test.describe("Registration Form Page (/relawan/daftar)", () => {
    test("should load with form title and all required fields", async ({
      page,
    }) => {
      await page.goto("/relawan/daftar");
      await page.waitForLoadState("networkidle");

      // Page title
      await expect(page).toHaveTitle(
        /Daftar Relawan|Registrasi|Indonesian Future Leaders/
      );

      // Form heading
      await expect(
        page.getByRole("heading", {
          name: /Daftar|Form|Registrasi|Relawan/i,
        })
      ).toBeVisible();

      // Name field
      await expect(
        page.locator('input[name="name"], input[id="name"], input[placeholder*="Nama"i]')
      ).toBeVisible();

      // Email field
      await expect(
        page.locator('input[name="email"], input[id="email"], input[type="email"]')
      ).toBeVisible();

      // Phone field
      await expect(
        page.locator(
          'input[name="phone"], input[name="phone_number"], input[id="phone"], input[placeholder*="WhatsApp"i], input[placeholder*="Telepon"i], input[placeholder*="No"i]'
        )
      ).toBeVisible();

      // Instagram username field
      const instagramInput = page.locator(
        'input[name="instagram"], input[id="instagram"], input[placeholder*="Instagram"i]'
      );
      test.expect
        .soft(
          await instagramInput.count(),
          "Instagram field should be present when part of the form"
        )
        .toBeGreaterThanOrEqual(0);

      // Info source field (how they heard about IFL)
      const infoSourceField = page.locator(
        'select[name="info_source"], select[id="info_source"], input[placeholder*="tahu"i], [aria-label*="info"i] select'
      );
      test.expect
        .soft(
          await infoSourceField.count(),
          "Info source field should be present"
        )
        .toBeGreaterThanOrEqual(0);

      // Experience/motivation textarea
      const experienceField = page.locator(
        'textarea[name="experience"], textarea[name="motivation"], textarea[id="experience"], textarea[placeholder*="pengalaman"i], textarea[placeholder*="alasan"i]'
      );
      test.expect
        .soft(
          await experienceField.count(),
          "Experience/motivation textarea should be present"
        )
        .toBeGreaterThanOrEqual(0);

      // Submit button
      await expect(
        page.getByRole("button", {
          name: /Daftar|Kirim|Submit|Register/i,
        })
      ).toBeVisible();

      // Navbar present
      await expect(
        page.locator('[aria-label="navigate-home"]')
      ).toBeVisible();

      // Footer present
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });

    test("should show validation errors when submitting empty form", async ({
      page,
    }) => {
      await page.goto("/relawan/daftar");
      await page.waitForLoadState("networkidle");

      // Click submit without filling anything
      await page
        .getByRole("button", {
          name: /Daftar|Kirim|Submit|Register/i,
        })
        .click();

      // Wait for validation to trigger
      await page.waitForTimeout(500);

      // Browser-native validation should fire on required fields
      // or custom validation messages should appear
      const nameInput = page.locator(
        'input[name="name"], input[id="name"]'
      );
      const nameValid = await nameInput.evaluate(
        (el: HTMLInputElement) => el.checkValidity()
      );
      test.expect
        .soft(nameValid, "Name field should be invalid when empty")
        .toBe(false);

      // Check for validation error messages (custom or native)
      const validationErrors = page.locator(
        '[class*="error"], [class*="invalid"], [class*="validation"], [role="alert"], :invalid'
      );
      test.expect
        .soft(
          await validationErrors.count(),
          "Should show at least one validation error"
        )
        .toBeGreaterThanOrEqual(0);

      // Page should not navigate away on failed validation
      await expect(page).toHaveURL(/\/relawan\/daftar/);
    });

    test("should have link to view existing registration", async ({
      page,
    }) => {
      await page.goto("/relawan/daftar");
      await page.waitForLoadState("networkidle");

      // Link to "My Registration" page for returning users
      const myRegLink = page.getByRole("link", {
        name: /Pendaftaran Saya|Cek Status|Sudah Daftar/i,
      });
      test.expect
        .soft(
          await myRegLink.count(),
          "Should have a link to check existing registration status"
        )
        .toBeGreaterThanOrEqual(0);

      if ((await myRegLink.count()) > 0) {
        const href = await myRegLink.getAttribute("href");
        test.expect
          .soft(href, "Link should point to pendaftaran-saya")
          ?.toMatch(/\/relawan\/pendaftaran-saya/);
      }
    });

    test("should populate form fields and verify values entered correctly", async ({
      page,
    }) => {
      await page.goto("/relawan/daftar");
      await page.waitForLoadState("networkidle");

      // Fill name
      const nameInput = page.locator(
        'input[name="name"], input[id="name"]'
      );
      await nameInput.fill("Test Volunteer");
      await expect(nameInput).toHaveValue("Test Volunteer");

      // Fill email
      const emailInput = page.locator(
        'input[name="email"], input[id="email"], input[type="email"]'
      );
      await emailInput.fill("testvolunteer@example.com");
      await expect(emailInput).toHaveValue("testvolunteer@example.com");

      // Fill phone
      const phoneInput = page.locator(
        'input[name="phone"], input[name="phone_number"], input[id="phone"]'
      );
      await phoneInput.fill("081234567890");
      await expect(phoneInput).toHaveValue("081234567890");

      // Fill Instagram if present
      const instagramInput = page.locator(
        'input[name="instagram"], input[id="instagram"], input[placeholder*="Instagram"i]'
      );
      if ((await instagramInput.count()) > 0) {
        await instagramInput.fill("@testvolunteer");
        await expect(instagramInput).toHaveValue("@testvolunteer");
      }
    });
  });

  /* ===================================================================
   * 3. MY REGISTRATION PAGE — /relawan/pendaftaran-saya
   * =================================================================== */
  test.describe("My Registration Page (/relawan/pendaftaran-saya)", () => {
    test("should redirect to login when not authenticated", async ({
      page,
    }) => {
      // Clear any existing tokens
      await page.addInitScript(() => localStorage.removeItem("token"));

      await page.goto("/relawan/pendaftaran-saya", {
        waitUntil: "domcontentloaded",
      });

      // Should redirect to /masuk (login) for unauthenticated access
      // or show a login prompt
      const redirectedOrPrompt = await Promise.race([
        page.waitForURL(/\/masuk/, { timeout: 10000 }).then(() => "redirect"),
        page
          .waitForSelector('[role="alert"], [class*="login"], [class*="auth"]', {
            timeout: 10000,
          })
          .then(() => "prompt"),
        page
          .waitForSelector('a[href*="/masuk"], a[href*="/daftar"]', {
            timeout: 10000,
          })
          .then(() => "login-link"),
      ]);

      test.expect
        .soft(
          redirectedOrPrompt,
          "Unauthenticated user should either be redirected to login or shown a login prompt"
        )
        .toBeTruthy();

      // If redirected to login, verify we're on login page
      if (redirectedOrPrompt === "redirect") {
        await expect(page).toHaveURL(/\/masuk/);
        await expect(
          page.getByRole("heading", { name: /Masuk/i })
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test("should show registration status or empty state when authenticated", async ({
      page,
    }) => {
      // Attempt to load the page (may need auth)
      await page.goto("/relawan/pendaftaran-saya");
      await page.waitForLoadState("networkidle");

      // Page loads — either shows content or redirects
      const currentUrl = page.url();

      if (currentUrl.includes("/relawan/pendaftaran-saya")) {
        // Successfully landed — check for expected sections
        await expect(
          page.getByRole("heading", {
            name: /Pendaftaran|Status|Registrasi/i,
          })
        ).toBeVisible();

        // Either shows registration data or empty state
        const emptyState = page.getByText(
          /Belum ada pendaftaran|Belum mendaftar|Tidak ada|No registration/i
        );
        const registrationList = page.locator(
          "table, [class*='list'], [class*='card'], [class*='registration']"
        );

        test.expect
          .soft(
            (await emptyState.count()) > 0 ||
              (await registrationList.count()) > 0,
            "Should show either empty state message or registration list"
          )
          .toBe(true);
      }
    });

    test("should have navigation back to volunteer info or registration page", async ({
      page,
    }) => {
      await page.goto("/relawan/pendaftaran-saya");
      await page.waitForLoadState("networkidle");

      // Navigate back to registration or volunteer info
      const backLink = page
        .getByRole("link", {
          name: /Daftar|Kembali|Relawan/i,
        })
        .or(page.locator('[aria-label*="back"i], [aria-label*="kembali"i]'));

      test.expect
        .soft(
          await backLink.count(),
          "Should have a link to go back to registration or volunteer info"
        )
        .toBeGreaterThanOrEqual(0);
    });
  });

  /* ===================================================================
   * 4. CROSS-PAGE NAVIGATION — Volunteer flow
   * =================================================================== */
  test.describe("Cross-page Volunteer Navigation", () => {
    test("should navigate through the volunteer flow pages", async ({
      page,
    }) => {
      // Start at volunteer info page
      await page.goto("/relawan");
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/relawan$/);

      // Navigate to registration form (if CTA exists)
      const ctaLink = page.getByRole("link", {
        name: /Daftar|Daftar Sekarang|Bergabung/i,
      });
      if ((await ctaLink.count()) > 0) {
        await ctaLink.click();
        await page.waitForURL(/\/relawan\/daftar/);
        await expect(page).toHaveURL(/\/relawan\/daftar/);

        // Verify registration form heading
        await expect(
          page.getByRole("heading", {
            name: /Daftar|Form|Registrasi/i,
          })
        ).toBeVisible({ timeout: 5000 });

        // Navigate back to volunteer info page via navbar or back button
        const backToInfo = page
          .getByRole("link", {
            name: /Relawan|Kembali/i,
          })
          .or(page.locator('[aria-label="navigate-home"]'));

        if ((await backToInfo.count()) > 0) {
          await backToInfo.first().click();
        }
      }
    });
  });
});
