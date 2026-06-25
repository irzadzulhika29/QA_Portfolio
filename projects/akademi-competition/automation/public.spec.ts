import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  /**
   * Helper: wait for the app shell (navbar + footer) to be fully rendered.
   * The app uses React.lazy + Suspense, so we wait for key layout elements.
   */
  const waitForAppShell = async (page: import("@playwright/test").Page) => {
    // Wait for the navbar to be visible
    await expect(page.locator("nav")).toBeVisible({ timeout: 15000 });
    // Wait for the footer to be visible
    await expect(page.locator("footer")).toBeVisible({ timeout: 15000 });
  };

  test.describe("Home page", () => {
    test("loads with hero section, nav, and footer", async ({ page }) => {
      await page.goto("/");
      await waitForAppShell(page);

      // Navbar logo is present
      await expect(page.locator('a[href="/"] img[alt="logo ac"]')).toBeVisible();

      // Hero section should be rendered
      await expect(page.locator("header")).toBeVisible();

      // Page title should match (HomePage SEO title)
      await expect(page).toHaveTitle(/Akademi Competition/);

      // Footer contains copyright text
      await expect(page.locator("footer")).toContainText(/Akademi Competition/);
    });
  });

  test.describe("Info Lomba page", () => {
    test("loads and displays page header", async ({ page }) => {
      await page.goto("/info-lomba");
      await waitForAppShell(page);

      // Page title should be set
      await expect(page).toHaveTitle(/Info Lomba/);

      // Page header should show the badge text
      await expect(page.locator("text=Temukan Peluangmu")).toBeVisible();

      // There should be a title indicating this is the info lomba page
      await expect(page.locator("text=Info Lomba").first()).toBeVisible();
    });
  });

  test.describe("Product catalog page", () => {
    test("loads the program / product page", async ({ page }) => {
      await page.goto("/product");
      await waitForAppShell(page);

      // The page should have the product/program layout
      await expect(page).toHaveTitle(/Program|Produk/);
    });
  });

  test.describe("Product detail page", () => {
    test("loads product detail for a valid class ID", async ({ page }) => {
      // Navigate to a specific product detail page
      await page.goto("/product/detail/1");
      await waitForAppShell(page);

      // The detail product view should render
      // Should show breadcrumbs navigation
      await expect(page.locator("text=Beranda").first()).toBeVisible();
      await expect(page.locator("text=Program & Produk").first()).toBeVisible();

      // Page title should mention "Detail"
      const title = await page.title();
      expect(title).toContain("Detail");
    });
  });

  test.describe("Mentor page", () => {
    test("loads mentor list page", async ({ page }) => {
      await page.goto("/mentor");
      await waitForAppShell(page);

      // Page title should indicate Mentor
      await expect(page).toHaveTitle(/Mentor/);

      // Page header should show "Expert Mentor"
      await expect(page.locator("text=Expert Mentor").first()).toBeVisible();

      // Mentor sections exist (Business Case, Debate, UI/UX)
      await expect(page.locator("text=Business Case").first()).toBeVisible();
    });
  });

  test.describe("Prestasi page", () => {
    test("loads achievements / prestasi page", async ({ page }) => {
      await page.goto("/prestasi");
      await waitForAppShell(page);

      // Page title should indicate Prestasi
      await expect(page).toHaveTitle(/Prestasi/);

      // Header contains achievement text
      await expect(page.locator("text=Prestasi").first()).toBeVisible();
    });
  });

  test.describe("Tentang Kami page", () => {
    test("loads about us page", async ({ page }) => {
      await page.goto("/tentang-kami");
      await waitForAppShell(page);

      // Page title should indicate Tentang Kami
      await expect(page).toHaveTitle(/Tentang Kami/);

      // Page header should show the main title
      await expect(page.locator("text=Mencetak Juara Indonesia").first()).toBeVisible();

      // Founder & Co-Founder section exists
      await expect(page.locator("text=Founder & Co-Founder").first()).toBeVisible();
    });
  });

  test.describe("Legal pages", () => {
    test("kebijakan privasi loads", async ({ page }) => {
      await page.goto("/kebijakan-privasi");
      await waitForAppShell(page);

      // Page title should be Kebijakan Privasi
      await expect(page).toHaveTitle(/Kebijakan Privasi/);

      // Main heading should be visible
      await expect(page.locator("text=Kebijakan Privasi").first()).toBeVisible();
    });

    test("syarat dan ketentuan loads", async ({ page }) => {
      await page.goto("/syarat-dan-ketentuan");
      await waitForAppShell(page);

      // Page title should be Syarat dan Ketentuan
      await expect(page).toHaveTitle(/Syarat dan Ketentuan/);

      // Main heading should be visible
      await expect(page.locator("text=Syarat dan Ketentuan").first()).toBeVisible();
    });
  });

  test.describe("Team Builder redirect", () => {
    test("redirects to /login when not authenticated", async ({ page }) => {
      await page.goto("/team-builder");

      // The component checks isLoggedIn() and Navigate to /login
      await page.waitForURL("**/login", { timeout: 15000 });

      // Should now be on the login page
      expect(page.url()).toContain("/login");
    });
  });

  test.describe("404 page", () => {
    test("shows 404 for unknown routes", async ({ page }) => {
      await page.goto("/this-route-does-not-exist");

      // The NotFoundPage component renders a 404 heading
      await expect(page.locator("h1")).toContainText("404", { timeout: 10000 });
      await expect(page.locator("text=Page not found")).toBeVisible();
      await expect(page.locator("text=Back to Home")).toBeVisible();
    });
  });

  test.describe("Navbar navigation", () => {
    test("navigates between pages via navbar links", async ({ page }) => {
      await page.goto("/");
      await waitForAppShell(page);

      // Click "Info Lomba" link in the desktop nav
      // The nav link for Info Lomba is a <Link to="/info-lomba"> with text "Info Lomba"
      const infoLombaLink = page.locator('nav a[href="/info-lomba"]').first();
      await infoLombaLink.click();
      await page.waitForURL("**/info-lomba", { timeout: 10000 });
      await expect(page).toHaveTitle(/Info Lomba/);

      // Navigate to Product page
      const productLink = page.locator('nav a[href="/product"]').first();
      await productLink.click();
      await page.waitForURL("**/product", { timeout: 10000 });
      await expect(page).toHaveTitle(/Program|Produk/);

      // Navigate back to Home via logo
      const logoLink = page.locator('nav a[href="/"]').first();
      await logoLink.click();
      await page.waitForURL("**/", { timeout: 10000 });
      await expect(page).toHaveTitle(/Akademi Competition/);
    });

    test("footer links navigate to legal pages", async ({ page }) => {
      await page.goto("/");
      await waitForAppShell(page);

      // Scroll to footer to ensure it's visible
      await page.locator("footer").scrollIntoViewIfNeeded();

      // Click Kebijakan Privasi link in footer
      await page.locator('footer a[href="/kebijakan-privasi"]').click();
      await page.waitForURL("**/kebijakan-privasi", { timeout: 10000 });
      await expect(page).toHaveTitle(/Kebijakan Privasi/);

      // Navigate back home
      await page.goto("/");
      await waitForAppShell(page);
      await page.locator("footer").scrollIntoViewIfNeeded();

      // Click Syarat & Ketentuan link in footer
      await page.locator('footer a[href="/syarat-dan-ketentuan"]').click();
      await page.waitForURL("**/syarat-dan-ketentuan", { timeout: 10000 });
      await expect(page).toHaveTitle(/Syarat dan Ketentuan/);
    });
  });
});
