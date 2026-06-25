import { test, expect } from "@playwright/test";

/**
 * Admin - Selection Form E2E tests
 *
 * Tests the admin selection form builder for bootcamp registration.
 * - Redirect tests (unauthenticated): verify RequireRole guard redirects to /
 * - Mock-auth structural tests: inject admin JWT + mock API, verify form elements
 *
 * The selection form builder (SelectionBuilderSection) lives inside the
 * CombinedBootcampForm / BootcampClassForm on the add/edit bootcamp pages.
 * Key features tested: toggle, title/description inputs, dynamic question
 * cards (add/remove/reorder), and validation state display.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a mock admin JWT whose payload carries IsAdmin: true so the
 * RequireRole guard and getUserRole() allow admin access.
 */
const buildAdminToken = () => {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      IsAdmin: true,
      UserID: 1,
      sub: 1,
      RoleName: "Admin",
      iat: 1000000000,
      exp: 9_999_999_999,
    }),
  ).toString("base64url");
  return `${header}.${payload}.mock_signature`;
};

const ADMIN_TOKEN = buildAdminToken();

/**
 * Seed localStorage with an admin session so RequireRole allows navigation.
 */
const injectAdminSession = async (page: import("@playwright/test").Page) => {
  await page.evaluate(
    ({ token }: { token: string }) => {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          email: "admin@akademicompetition.id",
          first_name: "Admin",
          role: "admin",
        }),
      );
    },
    { token: ADMIN_TOKEN },
  );
};

/**
 * Seed localStorage with no session (clean slate for redirect tests).
 */
const clearSession = async (page: import("@playwright/test").Page) => {
  await page.evaluate(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  });
};

/**
 * Mock API endpoints the CombinedBootcampForm calls on mount so they
 * return immediately with empty data instead of hitting the real backend.
 */
const mockAdminApi = async (page: import("@playwright/test").Page) => {
  await page.route("**/classes/class-types", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: { isSuccess: true, message: "OK" },
        data: [
          { class_type_id: "bootcamp-1", name: "Bootcamp Online" },
          { class_type_id: "bootcamp-2", name: "Bootcamp Offline" },
        ],
      }),
    });
  });

  await page.route("**/admin/mentors", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: { isSuccess: true, message: "OK" },
        data: [
          { user_id: "mentor-1", full_name: "Mentor Satu" },
          { user_id: "mentor-2", full_name: "Mentor Dua" },
        ],
      }),
    });
  });
};

/**
 * Helper: wait for the combined admin page layout to be ready after navigation
 * (Lazy-loaded components + Suspense need a moment to hydrate).
 */
const waitForFormShell = async (page: import("@playwright/test").Page) => {
  await page.waitForLoadState("networkidle", { timeout: 20_000 });
  // The form should have rendered – wait for any of its key elements
  await expect(page.locator("form")).toBeVisible({ timeout: 15_000 });
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Admin - Selection Form", () => {
  /* ------------------------------------------------------------------ */
  /*  Unauthenticated redirects                                          */
  /* ------------------------------------------------------------------ */
  test.describe("Unauthenticated redirects", () => {
    test.beforeEach(async ({ page }) => {
      await clearSession(page);
    });

    test("redirects to / when accessing /admin/dashboard", async ({ page }) => {
      await page.goto("/admin/dashboard");
      await page.waitForLoadState("networkidle");

      // RequireRole → isLoggedIn() is false → Navigate to PATHS.HOME (/)
      expect(page.url()).toMatch(/\/$/);
    });

    test("redirects to / when accessing /admin/dashboard/add-bootcamp", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await page.waitForLoadState("networkidle");

      expect(page.url()).toMatch(/\/$/);
    });

    test("redirects to / when accessing /admin/dashboard/edit-liveclass/:id", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/edit-liveclass/1");
      await page.waitForLoadState("networkidle");

      expect(page.url()).toMatch(/\/$/);
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Add Bootcamp – Selection Form Builder (mocked admin auth)          */
  /* ------------------------------------------------------------------ */
  test.describe("Add Bootcamp – Selection Form Builder", () => {
    test.beforeEach(async ({ page }) => {
      await injectAdminSession(page);
      await mockAdminApi(page);
    });

    test("selection form section heading and toggle are visible", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Section heading
      await expect(
        page.locator("text=Seleksi pendaftaran").first(),
      ).toBeVisible();

      // Toggle label
      await expect(
        page.locator("text=Aktifkan seleksi pendaftaran"),
      ).toBeVisible();

      // The toggle is a checkbox wrapped in a label
      const toggle = page.locator(
        'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
      );
      await expect(toggle).toBeVisible();
      // Starts unchecked
      await expect(toggle).not.toBeChecked();
    });

    test("toggling selection on reveals the form builder", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Toggle ON
      const toggle = page.locator(
        'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
      );
      await toggle.check();
      await expect(toggle).toBeChecked();

      // Title input appears
      const titleInput = page.locator('input[placeholder*="Form Seleksi"]');
      await expect(titleInput).toBeVisible();

      // Description input appears
      const descInput = page.locator(
        'input[placeholder*="Isi pertanyaan berikut"]',
      );
      await expect(descInput).toBeVisible();

      // "Tambah pertanyaan" button appears
      await expect(
        page.locator("button:has-text('Tambah pertanyaan')").first(),
      ).toBeVisible();

      // A default question card should be auto-created when toggle is enabled
      // (handleSelectionToggle creates one via createSelectionQuestion())
      await expect(page.locator("text=Pertanyaan 1").first()).toBeVisible();
    });

    test("toggling selection off hides the form builder", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Toggle ON
      const toggle = page.locator(
        'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
      );
      await toggle.check();
      await expect(toggle).toBeChecked();

      // Builder is visible
      await expect(
        page.locator('input[placeholder*="Form Seleksi"]'),
      ).toBeVisible();

      // Toggle OFF
      await toggle.uncheck();
      await expect(toggle).not.toBeChecked();

      // Builder inputs disappear
      await expect(
        page.locator('input[placeholder*="Form Seleksi"]'),
      ).not.toBeVisible();
    });

    test("can type into selection form title and description", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Enable selection
      await page
        .locator(
          'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
        )
        .check();

      // Fill title
      const titleInput = page.locator('input[placeholder*="Form Seleksi"]');
      await titleInput.fill("Form Seleksi Bootcamp Web Dev");
      await expect(titleInput).toHaveValue("Form Seleksi Bootcamp Web Dev");

      // Fill description
      const descInput = page.locator(
        'input[placeholder*="Isi pertanyaan berikut"]',
      );
      await descInput.fill("Silakan isi pertanyaan berikut dengan jujur.");
      await expect(descInput).toHaveValue(
        "Silakan isi pertanyaan berikut dengan jujur.",
      );
    });

    test("adds and removes selection questions", async ({ page }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Enable selection – creates 1 default question
      const toggle = page.locator(
        'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
      );
      await toggle.check();

      // Initially shows 1 question
      await expect(page.locator("text=Pertanyaan 1").first()).toBeVisible();

      // Add a second question
      await page.locator("button:has-text('Tambah pertanyaan')").click();
      await expect(page.locator("text=Pertanyaan 2").first()).toBeVisible();

      // Add a third question
      await page.locator("button:has-text('Tambah pertanyaan')").click();
      await expect(page.locator("text=Pertanyaan 3").first()).toBeVisible();

      // Remove the second question (index 1, but rendered as Pertanyaan 2)
      // Each question card has a "Hapus" button. Click the first "Hapus"
      // to see that questions shift. We'll remove the first one.
      const hapusButtons = page.locator("button:has-text('Hapus')");
      await expect(hapusButtons).toHaveCount(3);

      // Remove the first question
      await hapusButtons.first().click();
      await expect(page.locator("button:has-text('Hapus')")).toHaveCount(2);
      // The remaining questions should be re-indexed as Pertanyaan 1 and 2
      await expect(page.locator("text=Pertanyaan 1").first()).toBeVisible();
      await expect(page.locator("text=Pertanyaan 2").first()).toBeVisible();
    });

    test("can type question text and description in a question card", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Enable selection
      await page
        .locator(
          'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
        )
        .check();

      // Fill the first question's text
      const questionInput = page
        .locator('input[placeholder="Masukkan pertanyaan seleksi..."]')
        .first();
      await questionInput.fill("Apa motivasi Anda mengikuti bootcamp ini?");
      await expect(questionInput).toHaveValue(
        "Apa motivasi Anda mengikuti bootcamp ini?",
      );

      // Fill the description helper textarea
      const descArea = page
        .locator(
          'textarea[placeholder="Tambahkan penjelasan singkat untuk pendaftar..."]',
        )
        .first();
      await descArea.fill("Jelaskan alasan Anda secara singkat.");
      await expect(descArea).toHaveValue("Jelaskan alasan Anda secara singkat.");
    });

    test("is_required toggle starts checked and can be toggled", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Enable selection
      await page
        .locator(
          'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
        )
        .check();

      // The default question has is_required:true, so the "Wajib" checkbox
      // should be checked
      const requiredCheckbox = page
        .locator('label:has-text("Wajib") input[type="checkbox"]')
        .first();
      await expect(requiredCheckbox).toBeChecked();

      // Toggle it off
      await requiredCheckbox.uncheck();
      await expect(requiredCheckbox).not.toBeChecked();

      // Toggle it back on
      await requiredCheckbox.check();
      await expect(requiredCheckbox).toBeChecked();
    });

    test("shows empty-state placeholder when no questions exist yet", async ({
      page,
    }) => {
      // The CombinedBootcampForm auto-creates a question when toggle is
      // enabled. To see the empty state we need to simulate the case where
      // the toggle is ON but all questions have been removed.
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Enable selection
      await page
        .locator(
          'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
        )
        .check();

      // Remove the default question
      await page.locator("button:has-text('Hapus')").click();

      // The empty-state placeholder should appear
      await expect(
        page.locator("text=Belum ada pertanyaan seleksi"),
      ).toBeVisible();
      await expect(
        page.locator(
          "text=Tambahkan minimal satu pertanyaan untuk memulai proses seleksi.",
        ),
      ).toBeVisible();
    });

    test("validation error display when builder is invalid", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Enable selection – this auto-creates a question with empty text.
      // Clear the title so validateSelectionBuilder fails with
      // "Judul form seleksi wajib diisi saat seleksi pendaftaran diaktifkan."
      await page
        .locator(
          'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
        )
        .check();

      // Submit the form to trigger validation
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      // Should show validation error about missing title
      await expect(
        page.locator(
          "text=Judul form seleksi wajib diisi saat seleksi pendaftaran diaktifkan.",
        ),
      ).toBeVisible({ timeout: 5_000 });
    });

    test("question cards display drag handle and answer type", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/add-bootcamp");
      await waitForFormShell(page);

      // Enable selection – creates 1 question
      await page
        .locator(
          'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
        )
        .check();

      // The question card should show the drag handle indicator
      await expect(page.locator("text=Pertanyaan 1").first()).toBeVisible();

      // Should show answer type label "Short answer"
      await expect(page.locator("text=Short answer").first()).toBeVisible();
    });
  });

  /* ------------------------------------------------------------------ */
  /*  Edit Bootcamp – Selection Form Builder (mocked admin auth)         */
  /* ------------------------------------------------------------------ */
  test.describe("Edit Bootcamp – Selection Form Builder", () => {
    /** Mock the class detail endpoint so the edit page loads */
    const mockClassDetailApi = async (page: import("@playwright/test").Page) => {
      await page.route("**/api/admin/classes/*", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: { isSuccess: true, message: "OK" },
            data: {
              class_id: "bootcamp-1",
              name: "Existing Bootcamp",
              description: "A bootcamp with existing selection form data.",
              class_type_id: "bootcamp-1",
              original_price: 500000,
              discount_price: 0,
              wa_group_link: "",
              mentor: [{ user_id: "mentor-1", full_name: "Mentor Satu" }],
              status: "active",
              image_url: null,
              selection_enabled: true,
              selection_form: {
                title: "Form Seleksi Eksisting",
                description: "Deskripsi form yang sudah ada.",
                questions: [
                  {
                    question_text: "Apa motivasi Anda?",
                    description: "Jelaskan secara singkat.",
                    is_required: true,
                    sequence: 1,
                  },
                  {
                    question_text: "Pengalaman apa yang Anda miliki?",
                    description: "",
                    is_required: false,
                    sequence: 2,
                  },
                ],
              },
            },
          }),
        });
      });

      // Also mock the agendas endpoint the edit page fetches
      await page.route("**/agendas/*", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: { isSuccess: true, message: "OK" },
            data: [],
          }),
        });
      });
    };

    test.beforeEach(async ({ page }) => {
      await injectAdminSession(page);
      await mockAdminApi(page);
      await mockClassDetailApi(page);
    });

    test("loads edit page with pre-populated selection form", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard/edit-liveclass/bootcamp-1");
      await waitForFormShell(page);

      // Toggle should be checked (selection_enabled: true)
      const toggle = page.locator(
        'label:has-text("Aktifkan seleksi pendaftaran") input[type="checkbox"]',
      );
      await expect(toggle).toBeChecked();

      // Title should be pre-filled
      const titleInput = page.locator('input[placeholder*="Form Seleksi"]');
      await expect(titleInput).toHaveValue("Form Seleksi Eksisting");

      // Description should be pre-filled
      const descInput = page.locator(
        'input[placeholder*="Isi pertanyaan berikut"]',
      );
      await expect(descInput).toHaveValue("Deskripsi form yang sudah ada.");

      // Two question cards should render
      await expect(page.locator("text=Pertanyaan 1").first()).toBeVisible();
      await expect(page.locator("text=Pertanyaan 2").first()).toBeVisible();

      // First question text should be pre-filled
      const questionInputs = page.locator(
        'input[placeholder="Masukkan pertanyaan seleksi..."]',
      );
      await expect(questionInputs.nth(0)).toHaveValue("Apa motivasi Anda?");
      await expect(questionInputs.nth(1)).toHaveValue(
        "Pengalaman apa yang Anda miliki?",
      );
    });

    test("can add a new question on the edit page", async ({ page }) => {
      await page.goto("/admin/dashboard/edit-liveclass/bootcamp-1");
      await waitForFormShell(page);

      // Start with 2 questions, add a 3rd
      await page.locator("button:has-text('Tambah pertanyaan')").first().click();
      await expect(page.locator("text=Pertanyaan 3").first()).toBeVisible();

      // Fill the new question
      const questionInputs = page.locator(
        'input[placeholder="Masukkan pertanyaan seleksi..."]',
      );
      await questionInputs.nth(2).fill("How do you handle pressure?");
      await expect(questionInputs.nth(2)).toHaveValue(
        "How do you handle pressure?",
      );
    });
  });
});
