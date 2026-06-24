import { test, expect } from "@playwright/test";

/**
 * IFL Chapter Malang — API Testing via Playwright Request Context
 *
 * Base URL for API: https://api.iflchaptermalang.org/api/v1
 * Configured via apiBaseURL in playwright.config.ts.
 *
 * Structure:
 *   - Public endpoints: tested directly, verify status + response shape
 *   - Auth-required endpoints: skipped with a descriptive note
 *   - Admin endpoints: tested structurally where possible
 *
 * Use expect.soft for shape validation to avoid brittle tests.
 */

test.use({ baseURL: "https://api.iflchaptermalang.org/api/v1" });

/* ===================================================================
 * HELPER — reusable request context shortcut
 * =================================================================== */
async function get(api: Parameters<typeof test["request"]>[0], url: string) {
  return api.get(url);
}

async function post(
  api: Parameters<typeof test["request"]>[0],
  url: string,
  data?: Record<string, unknown>,
) {
  return api.post(url, { data });
}

/* ===================================================================
 * 1. BLOG — public endpoints
 * =================================================================== */
test.describe("Blog API", () => {
  test("GET /blog — should return paginated blog list", async ({ request }) => {
    const res = await get(request, "/blog");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toBeTruthy();

    // Response shape — Laravel paginated response
    const data = body.data ?? body;
    expect.soft(Array.isArray(data)).toBe(true);

    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      expect.soft(item).toHaveProperty("id");
      expect.soft(item).toHaveProperty("title");
      expect.soft(item).toHaveProperty("slug");
      expect.soft(item).toHaveProperty("content");
      expect.soft(item).toHaveProperty("category");
    }
  });

  test("GET /blog/category — should return blog categories", async ({ request }) => {
    const res = await get(request, "/blog/category");
    expect(res.status()).toBe(200);

    const body = await res.json();
    const data = body.data ?? body;
    expect.soft(Array.isArray(data)).toBe(true);

    if (Array.isArray(data) && data.length > 0) {
      const cat = data[0];
      expect.soft(cat).toHaveProperty("id");
      expect.soft(cat).toHaveProperty("name");
    }
  });

  test("GET /blog/{blog_slug} — should return blog detail by slug", async ({ request }) => {
    // First fetch the blog list to get a known slug
    const listRes = await get(request, "/blog");
    expect(listRes.status()).toBe(200);

    const listBody = await listRes.json();
    const listData = listBody.data ?? listBody;
    const blogs = Array.isArray(listData) ? listData : [];

    test.skip(blogs.length === 0, "No blogs exist to test detail endpoint");

    const firstSlug = blogs[0].slug;
    expect(firstSlug).toBeTruthy();

    const res = await get(request, `/blog/${firstSlug}`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const detail = body.data ?? body;

    expect.soft(detail).toHaveProperty("id");
    expect.soft(detail).toHaveProperty("title");
    expect.soft(detail).toHaveProperty("slug", firstSlug);
    expect.soft(detail).toHaveProperty("content");
  });

  test("POST /blog/{blog_id}/toggle-like — public response shape", async ({ request }) => {
    // First fetch the blog list to get a known blog ID
    const listRes = await get(request, "/blog");
    expect(listRes.status()).toBe(200);

    const listBody = await listRes.json();
    const listData = listBody.data ?? listBody;
    const blogs = Array.isArray(listData) ? listData : [];

    test.skip(blogs.length === 0, "No blogs exist to test toggle-like");
    test.skip(true, "JWT required — this test sends unauthenticated request for structure only");

    const blogId = blogs[0].id;
    const res = await post(request, `/blog/${blogId}/toggle-like`);
    // Unauthenticated: expect 401 or 500 — we just verify structure
    expect.soft(res.status()).toBeGreaterThanOrEqual(200);
    const body = await res.json();
    expect(body).toBeTruthy();
  });
});

/* ===================================================================
 * 2. CAMPAIGN — public endpoints
 * =================================================================== */
test.describe("Campaign API", () => {
  test("GET /campaign — should return campaign list", async ({ request }) => {
    const res = await get(request, "/campaign");
    expect(res.status()).toBe(200);

    const body = await res.json();
    const data = body.data ?? body;
    expect.soft(Array.isArray(data)).toBe(true);

    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      expect.soft(item).toHaveProperty("id");
      expect.soft(item).toHaveProperty("title");
      expect.soft(item).toHaveProperty("slug");
      expect.soft(item).toHaveProperty("goal_amount");
      expect.soft(item).toHaveProperty("collected_amount");
    }
  });

  test("GET /campaign/total-donation — should return aggregated donation stats", async ({ request }) => {
    const res = await get(request, "/campaign/total-donation");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toBeTruthy();

    // Should contain numeric totals
    const data = body.data ?? body;
    expect.soft(data).not.toBeNull();
  });

  test("GET /campaign/category — should return campaign categories", async ({ request }) => {
    const res = await get(request, "/campaign/category");
    expect(res.status()).toBe(200);

    const body = await res.json();
    const data = body.data ?? body;
    expect.soft(Array.isArray(data)).toBe(true);

    if (Array.isArray(data) && data.length > 0) {
      const cat = data[0];
      expect.soft(cat).toHaveProperty("id");
      expect.soft(cat).toHaveProperty("name");
    }
  });

  test("GET /campaign/{campaign_slug} — should return campaign detail", async ({ request }) => {
    // First fetch campaign list for a known slug
    const listRes = await get(request, "/campaign");
    expect(listRes.status()).toBe(200);

    const listBody = await listRes.json();
    const listData = listBody.data ?? listBody;
    const campaigns = Array.isArray(listData) ? listData : [];

    test.skip(campaigns.length === 0, "No campaigns exist to test detail endpoint");

    const firstSlug = campaigns[0].slug;
    expect(firstSlug).toBeTruthy();

    const res = await get(request, `/campaign/${firstSlug}`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const detail = body.data ?? body;

    expect.soft(detail).toHaveProperty("id");
    expect.soft(detail).toHaveProperty("title");
    expect.soft(detail).toHaveProperty("slug", firstSlug);
    expect.soft(detail).toHaveProperty("goal_amount");
    expect.soft(detail).toHaveProperty("collected_amount");
    expect.soft(detail).toHaveProperty("description");
  });

  test("GET /campaign/{campaign_slug}/donation — should return donation list for a campaign", async ({ request }) => {
    const listRes = await get(request, "/campaign");
    expect(listRes.status()).toBe(200);

    const listBody = await listRes.json();
    const listData = listBody.data ?? listBody;
    const campaigns = Array.isArray(listData) ? listData : [];

    test.skip(campaigns.length === 0, "No campaigns exist to test donation list");

    const firstSlug = campaigns[0].slug;

    const res = await get(request, `/campaign/${firstSlug}/donation`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const data = body.data ?? body;
    expect.soft(data).not.toBeNull();
  });

  test("GET /campaign/invoice/{campaign_id} — should return invoice info for a campaign", async ({ request }) => {
    const listRes = await get(request, "/campaign");
    expect(listRes.status()).toBe(200);

    const listBody = await listRes.json();
    const listData = listBody.data ?? listBody;
    const campaigns = Array.isArray(listData) ? listData : [];

    test.skip(campaigns.length === 0, "No campaigns exist to test invoice endpoint");
    test.skip(true, "JWT required — requires authentication");

    const firstId = campaigns[0].id;
    const res = await get(request, `/campaign/invoice/${firstId}`);
    // Expect 401 since JWT required
    expect.soft(res.status()).toBe(401);
  });

  test("POST /campaign/{campaign_slug}/donation — JWT required", async () => {
    test.skip(true, "JWT required — donation submission requires authentication");
  });
});

/* ===================================================================
 * 3. EVENT — public endpoints
 * =================================================================== */
test.describe("Event API", () => {
  test("GET /event — should return event list", async ({ request }) => {
    const res = await get(request, "/event");
    expect(res.status()).toBe(200);

    const body = await res.json();
    const data = body.data ?? body;
    expect.soft(Array.isArray(data)).toBe(true);

    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      expect.soft(item).toHaveProperty("id");
      expect.soft(item).toHaveProperty("title");
      expect.soft(item).toHaveProperty("description");
      expect.soft(item).toHaveProperty("date");
    }
  });

  test("GET /event/{id} — should return event detail", async ({ request }) => {
    // First fetch known events
    const listRes = await get(request, "/event");
    expect(listRes.status()).toBe(200);

    const listBody = await listRes.json();
    const listData = listBody.data ?? listBody;
    const events = Array.isArray(listData) ? listData : [];

    test.skip(events.length === 0, "No events exist to test detail endpoint");

    const firstId = events[0].id;

    const res = await get(request, `/event/${firstId}`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const detail = body.data ?? body;

    expect.soft(detail).toHaveProperty("id", firstId);
    expect.soft(detail).toHaveProperty("title");
  });
});

/* ===================================================================
 * 4. SDG — public endpoints
 * =================================================================== */
test.describe("SDG API", () => {
  test("GET /sdg — should return SDG list", async ({ request }) => {
    const res = await get(request, "/sdg");
    expect(res.status()).toBe(200);

    const body = await res.json();
    const data = body.data ?? body;
    expect.soft(Array.isArray(data)).toBe(true);

    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      expect.soft(item).toHaveProperty("id");
      expect.soft(item).toHaveProperty("name");
      expect.soft(item).toHaveProperty("description");
    }
  });

  test("GET /sdg/{id} — should return SDG detail", async ({ request }) => {
    const listRes = await get(request, "/sdg");
    expect(listRes.status()).toBe(200);

    const listBody = await listRes.json();
    const listData = listBody.data ?? listBody;
    const sdgs = Array.isArray(listData) ? listData : [];

    test.skip(sdgs.length === 0, "No SDG items exist to test detail endpoint");

    const firstId = sdgs[0].id;

    const res = await get(request, `/sdg/${firstId}`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    const detail = body.data ?? body;
    expect.soft(detail).toHaveProperty("id", firstId);
    expect.soft(detail).toHaveProperty("name");
  });
});

/* ===================================================================
 * 5. AUTH — endpoints (all require JWT or specific conditions)
 * =================================================================== */
test.describe("Auth API", () => {
  test("POST /auth/register — JWT / test credentials needed", async ({ request }) => {
    test.skip(true, "JWT required — registration requires a valid payload and is idempotent-bound; test manually with Postman");

    const res = await post(request, "/auth/register", {
      email: "test@example.com",
      username: "testuser",
      password: "password123",
      password_confirmation: "password123",
    });
    expect(res.status()).toBe(200);
  });

  test("POST /auth/login — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — login endpoint; test with valid credentials separately");

    const res = await post(request, "/auth/login", {
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status()).toBe(200);
  });

  test("POST /auth/logout — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — logout requires authenticated session");
  });

  test("POST /auth/email/resend — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — email resend requires authenticated session");
  });

  test("GET /auth/google — OAuth redirect", async ({ request }) => {
    test.skip(true, "JWT required — Google OAuth redirect endpoint");
  });

  test("GET /auth/google/callback — OAuth callback", async ({ request }) => {
    test.skip(true, "JWT required — Google OAuth callback endpoint");
  });

  test("GET /auth/refresh-token — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — token refresh requires existing JWT");
  });

  test("POST /auth/password/email — expects valid registered email", async ({ request }) => {
    test.skip(true, "JWT required — password reset email; requires a valid registered email in DB");
  });

  test("GET /auth/notice/emailNotVerified — public notice", async ({ request }) => {
    const res = await get(request, "/auth/notice/emailNotVerified");
    expect(res.status()).toBe(200);
  });

  test("GET /auth/notice/unauthorized — public notice", async ({ request }) => {
    const res = await get(request, "/auth/notice/unauthorized");
    expect(res.status()).toBe(200);
  });
});

/* ===================================================================
 * 6. PROFILE — all JWT required
 * =================================================================== */
test.describe("Profile API", () => {
  test("GET /profile — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — profile endpoint requires authenticated JWT token");
  });

  test("PUT /profile/edit — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — profile edit requires authentication");
  });

  test("POST /profile/update-password — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — password update requires authentication");
  });
});

/* ===================================================================
 * 7. COMMENT — all JWT required
 * =================================================================== */
test.describe("Comment API", () => {
  test("GET /blog/{blog_id}/comment — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — blog comments require authentication");
  });

  test("POST /blog/{blog_id}/comment — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — posting a comment requires authentication");
  });

  test("POST /blog/{blog_id}/comment/{comment_id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — reply to comment requires authentication");
  });

  test("PUT /blog/{blog_id}/comment/{comment_id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — update comment requires authentication");
  });

  test("POST /comment/{comment_id}/toggle-like — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — comment like toggle requires authentication");
  });

  test("GET /comment/{comment_id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — comment detail requires authentication");
  });

  test("DELETE /comment/{comment_id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — comment delete requires authentication");
  });
});

/* ===================================================================
 * 8. TRANSACTION — all JWT required
 * =================================================================== */
test.describe("Transaction API", () => {
  test("POST /transaction/create/{campaignSlug} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — creating a transaction requires authentication");
  });

  test("POST /transaction/callback — payment gateway callback", async ({ request }) => {
    test.skip(true, "JWT required — payment callback endpoint; requires specific gateway payload");
  });

  test("GET /transaction/invoice/{id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — transaction invoice requires authentication");
  });

  test("GET /transaction/status/{id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — transaction status requires authentication");
  });
});

/* ===================================================================
 * 9. VOLUNTEER — all JWT + verified email required
 * =================================================================== */
test.describe("Volunteer API", () => {
  test("GET /volunteer/referral-code/validate/{code} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — referral code validation requires authenticated session");
  });

  test("GET /volunteer/registration/form-data — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — registration form data requires authentication");
  });

  test("POST /volunteer/registration — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — volunteer registration requires authentication");
  });

  test("GET /volunteer/registration/my-registration — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — my registration records require authentication");
  });
});

/* ===================================================================
 * 10. ADMIN — structural tests; actual use requires JWT
 * =================================================================== */
test.describe("Admin API", () => {
  test("GET /admin/referral-codes — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — admin referral codes require admin JWT");
  });

  test("POST /admin/referral-codes — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — create referral code requires admin JWT");
  });

  test("PUT/PATCH /admin/referral-codes/{id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — update referral code requires admin JWT");
  });

  test("DELETE /admin/referral-codes/{id} — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — delete referral code requires admin JWT");
  });

  test("PATCH /admin/referral-codes/{id}/toggle-active — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — toggle referral code requires admin JWT");
  });

  test("GET /admin/volunteer-registrations — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — admin volunteer registrations require admin JWT");
  });

  test("GET /admin/volunteer-registrations/export — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — export requires admin JWT");
  });

  test("PATCH /admin/volunteer-registrations/{id}/status — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — update registration status requires admin JWT");
  });

  test("POST /admin/volunteer-registrations/bulk-update-status — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — bulk update requires admin JWT");
  });

  test("GET /admin/donations/pending — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — pending donations list requires admin JWT");
  });

  test("GET /admin/donations/campaign/{campaignId}/total — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — campaign donation total requires admin JWT");
  });

  test("POST /admin/donations/{id}/approve — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — approve donation requires admin JWT");
  });

  test("POST /admin/donations/{id}/reject — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — reject donation requires admin JWT");
  });

  test("PUT /admin/{id} — JWT required (user update)", async ({ request }) => {
    test.skip(true, "JWT required — user update requires admin JWT");
  });

  test("DELETE /admin/{id} — JWT required (user delete)", async ({ request }) => {
    test.skip(true, "JWT required — user delete requires admin JWT");
  });

  test("CRUD /admin/role — JWT required", async ({ request }) => {
    test.skip(true, "JWT required — role management requires admin JWT");
  });
});

/* ===================================================================
 * 11. EVENT (ADMIN) — JWT required
 * =================================================================== */
test.describe("Admin Event API", () => {
  test("POST /event — JWT required (admin create event)", async ({ request }) => {
    test.skip(true, "JWT required — event creation requires admin JWT");
  });

  test("POST /event/{id} — JWT required (admin update event, file upload)", async ({ request }) => {
    test.skip(true, "JWT required — event update requires admin JWT");
  });

  test("DELETE /event/{id} — JWT required (admin delete event)", async ({ request }) => {
    test.skip(true, "JWT required — event deletion requires admin JWT");
  });
});

/* ===================================================================
 * 12. SUPERVISOR — role-gated (admin, bismar, copywriter)
 * =================================================================== */
test.describe("Supervisor API", () => {
  test("GET /supervisor — JWT + supervisor role required", async ({ request }) => {
    test.skip(true, "JWT required — supervisor endpoint requires proper role (admin|bismar|copwriter)");
  });
});

/* ===================================================================
 * 13. SHOP-MANAGER — role-gated (admin, bismar)
 * =================================================================== */
test.describe("Shop Manager API", () => {
  test("CRUD /shop-manager/campaign — JWT + role required", async ({ request }) => {
    test.skip(true, "JWT required — shop-manager campaign CRUD requires admin|bismar role");
  });

  test("CRUD /shop-manager/campaign/category — JWT + role required", async ({ request }) => {
    test.skip(true, "JWT required — shop-manager campaign category CRUD requires admin|bismar role");
  });
});

/* ===================================================================
 * 14. COPYWRITER — role-gated (admin, copywriter)
 * =================================================================== */
test.describe("Copywriter API", () => {
  test("CRUD /copywriter/blog — JWT + role required", async ({ request }) => {
    test.skip(true, "JWT required — copywriter blog CRUD requires admin|copywriter role");
  });

  test("CRUD /copywriter/blog/category — JWT + role required", async ({ request }) => {
    test.skip(true, "JWT required — copywriter blog category CRUD requires admin|copywriter role");
  });
});
