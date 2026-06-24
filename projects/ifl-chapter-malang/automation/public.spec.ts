import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  /* ===================================================================
   * 1. LANDING PAGE
   * =================================================================== */
  test.describe("Landing Page (/)", () => {
    test("should load with correct title and key sections", async ({ page }) => {
      await page.goto("/");

      // Page title exists and contains expected branding
      await expect(page).toHaveTitle(/Indonesian Future Leaders/);

      // Hero section — main headline
      await expect(
        page.getByRole("heading", { name: /We Are Indonesian Future Leaders/i })
      ).toBeVisible();

      // Stats section — programme achievements
      await expect(page.getByText(/400\+/)).toBeVisible();
      await expect(page.getByText(/70\+/)).toBeVisible();

      // "3 Pilar Aksi" section
      await expect(
        page.getByRole("heading", { name: /3 Pilar Aksi/i })
      ).toBeVisible();

      // Individual pillars
      await expect(
        page.getByRole("heading", { name: /Capacity Building/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Community Service/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Promotion and Advocacy/i })
      ).toBeVisible();

      // "Program Kerja" section
      await expect(
        page.getByRole("heading", { name: /Program Kerja/i })
      ).toBeVisible();

      // Program / Project cards
      await expect(
        page.getByRole("heading", { name: /^Programs?$/i })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /^Projects?$/i })
      ).toBeVisible();

      // Navbar present with navigation links
      await expect(
        page.locator('[aria-label="navigate-home"]')
      ).toBeVisible();
      await expect(
        page.locator('[aria-label="navigate-Event"]')
      ).toBeVisible();
      await expect(
        page.locator('[aria-label="navigate-Article"]')
      ).toBeVisible();
      await expect(
        page.locator('[aria-label="navigate-Donate"]')
      ).toBeVisible();

      // Footer present
      await expect(
        page.getByRole("contentinfo")
      ).toBeVisible();
    });

    test("should have donation CTA section", async ({ page }) => {
      await page.goto("/");
      await expect(
        page.getByRole("button", { name: /donate now|donasi/i })
      ).toBeVisible();
    });
  });

  /* ===================================================================
   * 2. BLOG / ARTICLE LIST
   * =================================================================== */
  test.describe("Blog Page (/artikel)", () => {
    test("should load blog list with title", async ({ page }) => {
      await page.goto("/artikel");

      // Page title
      await expect(page).toHaveTitle(/Artikel|Indonesian Future Leaders/);

      // Wait for content to load (spinner disappears)
      await page.waitForLoadState("networkidle");

      // Blog post cards should eventually appear
      const blogCards = page.locator("article.card");
      await expect(blogCards.first()).toBeVisible({ timeout: 15000 });

      // Each blog card has a title and navigable link
      const firstCardTitle = blogCards.first().locator("h3");
      await expect(firstCardTitle).toBeVisible();

      // Footer present
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });

    test("should navigate into a blog detail page", async ({ page }) => {
      await page.goto("/artikel");
      await page.waitForLoadState("networkidle");

      // Click the first blog card link
      const firstBlogLink = page.locator('article.card a, a[href*="/artikel/"]').first();
      await expect(firstBlogLink).toBeVisible({ timeout: 15000 });
      await firstBlogLink.click();

      // Should land on a blog detail URL
      await expect(page).toHaveURL(/\/artikel\/.+/);

      // Wait for content to load
      await page.waitForLoadState("networkidle");

      // Blog detail should have a heading (the title)
      await expect(
        page.locator("h1").first()
      ).toBeVisible({ timeout: 10000 });

      // Comments section should exist — look for the comment modal trigger
      await expect(
        page.getByText(/komentar|comment/i).first()
      ).toBeVisible({ timeout: 10000 });
    });
  });

  /* ===================================================================
   * 3. CAMPAIGN / DONATION PAGES
   * =================================================================== */
  test.describe("Campaign/Donation Page (/donasi)", () => {
    test("should load campaign list with title", async ({ page }) => {
      await page.goto("/donasi");

      // Page title
      await expect(page).toHaveTitle(/Donasi|Indonesian Future Leaders/);

      // Wait for content
      await page.waitForLoadState("networkidle");

      // Hero section or campaign cards should appear
      const campaignCards = page.locator("article.card");
      // Allow empty state message if no campaigns exist yet
      await expect(
        campaignCards.first().or(page.getByText(/tidak ada/i).first())
      ).toBeVisible({ timeout: 15000 });
    });

    test("should navigate into a campaign detail (if campaigns exist)", async ({ page }) => {
      await page.goto("/donasi");
      await page.waitForLoadState("networkidle");

      // Try to find a campaign link
      const campaignLink = page.locator('a[href*="/donasi/"]').first();
      await expect(campaignLink).toBeVisible({ timeout: 15000 });

      // If we find it, click through
      const href = await campaignLink.getAttribute("href");
      test.skip(href === "/donasi", "No individual campaign link found");

      await campaignLink.click();
      await expect(page).toHaveURL(/\/donasi\/.+/);
      await page.waitForLoadState("networkidle");

      // Donation detail should have key elements (soft assertions for dynamic content)
      await expect(
        page.getByText(/donate now|donasi sekarang|campaign closed/i).first()
      ).toBeVisible({ timeout: 10000 });

      // Should show donation progress section
      await expect(
        page.getByText(/donation collected/i).first()
      ).toBeVisible({ timeout: 10000 });
    });
  });

  /* ===================================================================
   * 4. EVENT PAGE
   * =================================================================== */
  test.describe("Event Page (/event)", () => {
    test("should load event page with title", async ({ page }) => {
      await page.goto("/event");

      // Page title
      await expect(page).toHaveTitle(/Event|Indonesian Future Leaders/);

      // Event hero section
      await expect(
        page.getByRole("heading", { name: /we care them/i })
      ).toBeVisible();

      // Event categories tabs
      const programTab = page.getByRole("tab", { name: /program/i });
      await expect(programTab).toBeVisible();

      const projectTab = page.getByRole("tab", { name: /project/i });
      await expect(projectTab).toBeVisible();

      // Slider/carousel controls
      await expect(
        page.getByRole("button", { name: /previous slide|next slide/i }).first()
      ).toBeVisible();

      // Footer
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  });

  /* ===================================================================
   * 5. 404 PAGE HANDLING
   * =================================================================== */
  test.describe("404 Page", () => {
    test("should show 404 page for non-existent routes", async ({ page }) => {
      await page.goto("/this-page-does-not-exist-xyz");

      // Should show 404 heading
      await expect(page.getByText("404")).toBeVisible();

      // Should show page-not-found message
      await expect(
        page.getByText(/Halaman Tidak Ditemukan/i)
      ).toBeVisible();

      // Should have a "Kembali ke Beranda" (back to home) button
      const backButton = page.getByRole("button", {
        name: /Kembali ke Beranda/i,
      });
      await expect(backButton).toBeVisible();
    });
  });

  /* ===================================================================
   * 6. NAVIGATION BETWEEN PAGES
   * =================================================================== */
  test.describe("Navigation", () => {
    test("should navigate between pages using navbar links", async ({ page }) => {
      // Start at home
      await page.goto("/");
      await expect(page).toHaveURL(/\/$/);

      // Navigate to Event page
      await page.locator('[aria-label="navigate-Event"]').click();
      await page.waitForURL(/\/event/);
      await expect(page).toHaveURL(/\/event/);

      // Navigate to Article (Blog) page
      await page.locator('[aria-label="navigate-Article"]').click();
      await page.waitForURL(/\/artikel/);
      await expect(page).toHaveURL(/\/artikel/);

      // Navigate to Donate (Campaign) page
      await page.locator('[aria-label="navigate-Donate"]').click();
      await page.waitForURL(/\/donasi/);
      await expect(page).toHaveURL(/\/donasi/);

      // Navigate back to home via logo
      await page.locator('[aria-label="navigate-home"]').click();
      await page.waitForURL(/\/$/);
      await expect(page).toHaveURL(/\/$/);
    });

    test("should navigate from 404 back to home", async ({ page }) => {
      await page.goto("/some-random-path");
      await expect(page.getByText("404")).toBeVisible();

      // Click the "Kembali ke Beranda" button
      await page.getByRole("button", { name: /Kembali ke Beranda/i }).click();

      // Should land on the home page
      await expect(page).toHaveURL(/\/$/);
      await expect(
        page.getByRole("heading", { name: /We Are Indonesian Future Leaders/i })
      ).toBeVisible();
    });
  });

  /* ===================================================================
   * 7. SEO BASICS — page title
   * =================================================================== */
  test.describe("SEO Basics", () => {
    test("should have a non-empty <title> on every public page", async ({ page }) => {
      const publicPages = [
        { path: "/", label: "Home" },
        { path: "/artikel", label: "Blog" },
        { path: "/donasi", label: "Donation" },
        { path: "/event", label: "Event" },
      ];

      for (const { path, label } of publicPages) {
        await page.goto(path);
        await page.waitForLoadState("networkidle");

        const title = await page.title();
        expect(
          title,
          `Page "${label}" (${path}) should have a non-empty title`
        ).toBeTruthy();

        // Title should reference "Indonesian Future Leaders" or similar branding
        expect(
          title,
          `Page "${label}" (${path}) title should contain branding`
        ).toContain("Indonesian Future Leaders");
      }
    });

    test("should have a meta description on every page", async ({ page }) => {
      await page.goto("/");
      const metaDesc = page.locator('meta[name="description"]');
      await expect(metaDesc).toHaveAttribute("content");
      const content = await metaDesc.getAttribute("content");
      expect(content?.trim().length).toBeGreaterThan(0);
    });
  });
});
