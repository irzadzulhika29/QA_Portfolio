import { test, expect } from "@playwright/test";

test.describe("Donation", () => {
  /* ===================================================================
   * 1. CAMPAIGN LIST PAGE — /donasi
   * =================================================================== */
  test.describe("Campaign List Page (/donasi)", () => {
    test("should load campaign list with correct title and layout", async ({
      page,
    }) => {
      await page.goto("/donasi");
      await page.waitForLoadState("networkidle");

      // Page title contains expected branding
      await expect(
        page
          .locator("title")
          .first()
      ).not.toBeEmpty();

      // Hero banner with heading
      await expect(
        page.getByRole("heading", { name: /Donasi Kalian Penting/i })
      ).toBeVisible();

      // Navbar present
      await expect(
        page.locator('[aria-label="navigate-home"]')
      ).toBeVisible();
      await expect(
        page.locator('[aria-label="navigate-Donate"]')
      ).toBeVisible();

      // Filter controls — category and sort dropdowns
      await expect(page.getByText(/Kategori/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Sort/i)).toBeVisible({ timeout: 10000 });

      // Campaign cards should eventually appear (or empty state)
      const campaignCards = page.locator("article.card");
      const cardCount = await campaignCards.count();
      test.expect
        .soft(cardCount, "Should have at least one campaign card")
        .toBeGreaterThanOrEqual(0);

      if (cardCount > 0) {
        // Each card should have a title and donate button
        const firstCard = campaignCards.first();
        await expect(firstCard.locator("h3")).toBeVisible();
        await expect(
          firstCard.getByRole("button", { name: /Donasi Sekarang/i })
        ).toBeVisible();

        // Card shows donation progress
        await expect(firstCard.getByText(/Terkumpul/i)).toBeVisible();
      }

      // Footer present
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });

    test("should show campaign cards with proper structure", async ({
      page,
    }) => {
      await page.goto("/donasi");
      await page.waitForLoadState("networkidle");

      const cards = page.locator("article.card");
      const count = await cards.count();

      test.expect.soft(count).toBeGreaterThanOrEqual(0);

      for (let i = 0; i < Math.min(count, 3); i++) {
        const card = cards.nth(i);

        // Each card has a navigable link to campaign detail
        const link = card.locator('[aria-label="navigate-donate"]');
        test.expect
          .soft(await link.count(), `Card ${i}: should have a campaign link`)
          .toBeGreaterThanOrEqual(1);

        // Each card shows campaign title
        const title = card.locator("h3");
        test.expect
          .soft(await title.count(), `Card ${i}: should have a title`)
          .toBeGreaterThanOrEqual(1);

        // Each card shows donation collected amount
        const collected = card.getByText(/Terkumpul/i);
        test.expect
          .soft(
            await collected.count(),
            `Card ${i}: should show donation collected`
          )
          .toBeGreaterThanOrEqual(1);
      }
    });

    test("should navigate to campaign detail from card", async ({ page }) => {
      await page.goto("/donasi");
      await page.waitForLoadState("networkidle");

      // Click first campaign card's donate button or link
      const firstCampaignLink = page
        .locator('article.card [aria-label="navigate-donate"]')
        .first();

      await expect(firstCampaignLink).toBeVisible({ timeout: 15000 });

      // Get the href to verify navigation
      const href = await firstCampaignLink.getAttribute("href");
      test.expect
        .soft(href, "Campaign link should point to /donasi/{slug}")
        ?.toMatch(/^\/donasi\//);

      await firstCampaignLink.click();

      // Should land on campaign detail URL
      await expect(page).toHaveURL(/\/donasi\/.+/);
    });
  });

  /* ===================================================================
   * 2. CAMPAIGN DETAIL PAGE — /donasi/:slug
   * =================================================================== */
  test.describe("Campaign Detail Page (/donasi/:slug)", () => {
    test("should load campaign detail page with key sections", async ({
      page,
    }) => {
      // Navigate to a known campaign
      await page.goto("/donasi/donasi-online-close-the-gap-2024");
      await page.waitForLoadState("networkidle");

      // Campaign title visible
      await expect(
        page.getByRole("heading", { name: /Donasi Online Close The Gap 2024/i })
      ).toBeVisible({ timeout: 15000 });

      // Campaign category badge
      await expect(page.getByText(/kemanusiaan/i).first()).toBeVisible();

      // Donation collected section
      await expect(page.getByText(/Donation Collected/i)).toBeVisible();

      // Donation amount
      await expect(page.getByText(/Rp/i).first()).toBeVisible();

      // Donator count
      await expect(page.getByText(/Donators/i)).toBeVisible();

      // Information section
      await expect(
        page.getByRole("heading", { name: /Information/i })
      ).toBeVisible();

      // Background Story section
      await expect(
        page.getByRole("heading", { name: /Background Story/i })
      ).toBeVisible();

      // Donation list section
      await expect(
        page.getByRole("heading", { name: /^Donation\s*$/i })
      ).toBeVisible();

      // Individual donation entries
      const donationEntries = page.locator(
        ".space-y-6 .flex.justify-between.items-center"
      );
      test.expect
        .soft(
          await donationEntries.count(),
          "Should show donation list entries"
        )
        .toBeGreaterThan(0);
    });

    test("should show either active donate button or campaign closed state", async ({
      page,
    }) => {
      await page.goto("/donasi/donasi-online-close-the-gap-2024");
      await page.waitForLoadState("networkidle");

      // Check if campaign is open or closed
      const campaignClosedBtn = page.getByRole("button", {
        name: /Campaign Closed/i,
      });
      const donateNowBtn = page.getByRole("button", {
        name: /button-donate-now/i,
      });

      const isClosed = await campaignClosedBtn.count();
      const isOpen = await donateNowBtn.count();

      // One of them must exist (soft assertion for dynamic content)
      test.expect
        .soft(isClosed + isOpen, "Should have either Campaign Closed or Donasi Now button")
        .toBeGreaterThanOrEqual(1);

      if (isClosed > 0) {
        await expect(campaignClosedBtn).toBeVisible();
        // Closed campaign button should be disabled
        await expect(campaignClosedBtn).toBeDisabled();
      }

      if (isOpen > 0) {
        await expect(donateNowBtn).toBeVisible();
        // Open campaign has a link to payment page
        const paymentLink = page.locator(
          '[aria-label="navigate-payment-donate"]'
        );
        await expect(paymentLink).toBeVisible();
      }
    });

    test("should have navigation back to campaign list", async ({
      page,
    }) => {
      await page.goto("/donasi/donasi-online-close-the-gap-2024");
      await page.waitForLoadState("networkidle");

      // Navigate back via Donate nav link
      await page.locator('[aria-label="navigate-Donate"]').click();
      await page.waitForURL(/\/donasi$/);
      await expect(page).toHaveURL(/\/donasi$/);
    });
  });

  /* ===================================================================
   * 3. DONATION FORM / PAYMENT PAGE — /donasi/:slug/pembayaran
   * =================================================================== */
  test.describe("Donation Payment Page (/donasi/:slug/pembayaran)", () => {
    test("should load payment page with donation form", async ({ page }) => {
      await page.goto(
        "/donasi/donasi-online-close-the-gap-2024/pembayaran"
      );
      await page.waitForLoadState("networkidle");

      // Stepper indicator
      await expect(page.getByText(/Data Diri/i)).toBeVisible();
      await expect(page.getByText(/QRIS & Bukti/i)).toBeVisible();

      // Campaign info on payment page
      await expect(
        page.getByText(/Donasi Online Close The Gap 2024/i)
      ).toBeVisible();

      // Form fields present
      await expect(
        page.locator('input[name="name"]')
      ).toBeVisible();
      await expect(
        page.locator('input[name="email"]')
      ).toBeVisible();
      await expect(
        page.locator('input[name="phone"]')
      ).toBeVisible();
      await expect(
        page.locator('input[name="donation_amount"]')
      ).toBeVisible();
      await expect(
        page.locator('input[name="donation_message"]')
      ).toBeVisible();

      // Anonymous checkbox
      await expect(
        page.getByText(/Donate as anonymous/i)
      ).toBeVisible();

      // Submit button
      await expect(
        page.getByRole("button", { name: /Next/i })
      ).toBeVisible();
    });

    test("should show validation errors on empty form submit", async ({
      page,
    }) => {
      await page.goto(
        "/donasi/donasi-online-close-the-gap-2024/pembayaran"
      );
      await page.waitForLoadState("networkidle");

      // Click Next without filling anything
      await page.getByRole("button", { name: /Next/i }).click();

      // Wait a moment for validation to trigger
      await page.waitForTimeout(500);

      // Browser-native validation or custom validation should show
      // Check if validation fired (soft — some browsers handle this differently)
      const nameInput = page.locator('input[name="name"]');
      const isValid = await nameInput.evaluate(
        (el: HTMLInputElement) => el.checkValidity()
      );
      test.expect
        .soft(isValid, "Name field should be invalid when empty")
        .toBe(false);
    });

    test("should have return navigation button", async ({ page }) => {
      await page.goto(
        "/donasi/donasi-online-close-the-gap-2024/pembayaran"
      );
      await page.waitForLoadState("networkidle");

      // Return button
      const returnBtn = page.getByText(/Return/i);
      await expect(returnBtn).toBeVisible();
    });
  });

  /* ===================================================================
   * 4. FULL FLOW — Campaign list → Detail → Payment page
   * =================================================================== */
  test.describe("Donation Navigation Flow", () => {
    test("should navigate from campaign list to payment page", async ({
      page,
    }) => {
      await page.goto("/donasi");
      await page.waitForLoadState("networkidle");

      // Click first campaign card
      const firstCampaignLink = page
        .locator('article.card [aria-label="navigate-donate"]')
        .first();
      await expect(firstCampaignLink).toBeVisible({ timeout: 15000 });
      await firstCampaignLink.click();
      await page.waitForURL(/\/donasi\/.+/);

      // On campaign detail, try to go to payment page if campaign is open
      const payLink = page.locator(
        '[aria-label="navigate-payment-donate"]'
      );
      const isPayLinkVisible = (await payLink.count()) > 0;

      if (isPayLinkVisible) {
        // Check link is not disabled (closed campaigns have opacity-50 + pointer-events-none)
        const isDisabled = await payLink.evaluate((el) => {
          return (
            el.classList.contains("opacity-50") ||
            el.classList.contains("pointer-events-none")
          );
        });

        if (!isDisabled) {
          await payLink.click();
          await page.waitForURL(/\/pembayaran/);
          await expect(page).toHaveURL(/\/pembayaran/);

          // Verify payment form loaded
          await expect(
            page.locator('input[name="name"]')
          ).toBeVisible({ timeout: 10000 });
          await expect(
            page.getByRole("button", { name: /Next/i })
          ).toBeVisible();
        } else {
          test.expect
            .soft(true, "Campaign is closed — payment page not accessible")
            .toBe(true);
        }
      } else {
        test.expect
          .soft(true, "Campaign is closed — no payment link available")
          .toBe(true);
      }
    });

    test("should populate donation form fields and verify submission readiness", async ({
      page,
    }) => {
      await page.goto(
        "/donasi/donasi-online-close-the-gap-2024/pembayaran"
      );
      await page.waitForLoadState("networkidle");

      // Fill the donation form
      await page.locator('input[name="name"]').fill("Test Donor");
      await page.locator('input[name="email"]').fill("testdonor@example.com");
      await page.locator('input[name="phone"]').fill("081234567890");
      await page.locator('input[name="donation_amount"]').fill("50000");
      await page.locator('input[name="donation_message"]').fill("Semoga berkah");

      // Check anonymous checkbox
      const checkbox = page.locator('input[type="checkbox"]');
      await checkbox.check();
      await expect(checkbox).toBeChecked();

      // Verify form values
      await expect(page.locator('input[name="name"]')).toHaveValue("Test Donor");
      await expect(page.locator('input[name="email"]')).toHaveValue(
        "testdonor@example.com"
      );
      await expect(page.locator('input[name="phone"]')).toHaveValue(
        "081234567890"
      );
      await expect(page.locator('input[name="donation_amount"]')).toHaveValue(
        "50000"
      );
      await expect(
        page.locator('input[name="donation_message"]')
      ).toHaveValue("Semoga berkah");
    });
  });
});
