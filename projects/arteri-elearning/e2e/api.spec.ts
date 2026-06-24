import { test, expect } from "@playwright/test";
import { getApiBaseUrl } from "./utils/fixtures";

/**
 * API Smoke Tests - directly hit the backend without UI
 *
 * These tests don't need a browser - they verify backend contracts.
 * Run with: npx playwright test e2e/api.spec.ts --project=chromium
 */

test.describe("API: Public Endpoints", () => {
  test("GET /upcoming-exam returns list", async ({ request }) => {
    const res = await request.get(`${getApiBaseUrl()}/upcoming-exam`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
  });

  test("GET /province/all returns provinces", async ({ request }) => {
    const res = await request.get(`${getApiBaseUrl()}/province/all`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data) || typeof body.data === "object").toBeTruthy();
  });

  test("GET /city/all returns cities", async ({ request }) => {
    const res = await request.get(`${getApiBaseUrl()}/city/all`);
    expect(res.status()).toBe(200);
  });

  test("GET /teams returns team list", async ({ request }) => {
    const res = await request.get(`${getApiBaseUrl()}/teams`);
    expect(res.status()).toBe(200);
  });

  test("GET /courses/browse returns course list", async ({ request }) => {
    const res = await request.get(`${getApiBaseUrl()}/courses/browse`, {
      params: { page: "1", per_page: "10" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
  });
});

test.describe("API: Authentication", () => {
  test("POST /auth/login-elearning with valid creds returns token", async ({ request }) => {
    const res = await request.post(`${getApiBaseUrl()}/auth/login-elearning`, {
      data: {
        identifier: process.env.STUDENT_USER || "student.test@stuudi.id",
        password: process.env.STUDENT_PASSWORD || "Test1234!",
        device_info: "playwright-api-test",
      },
      headers: { "Content-Type": "application/json" },
    });

    // Either 200 with token or 401 if test user doesn't exist
    expect([200, 401]).toContain(res.status());

    if (res.status() === 200) {
      const body = await res.json();
      expect(body.data || body).toHaveProperty("token");
    }
  });

  test("POST /auth/login-elearning with wrong password returns 401", async ({ request }) => {
    const res = await request.post(`${getApiBaseUrl()}/auth/login-elearning`, {
      data: {
        identifier: "test@example.com",
        password: "wrongpassword",
        device_info: "playwright",
      },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 400]).toContain(res.status());
  });

  test("POST /auth/login-elearning with empty body returns 400", async ({ request }) => {
    const res = await request.post(`${getApiBaseUrl()}/auth/login-elearning`, {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
  });

  test("Protected endpoint without token returns 401", async ({ request }) => {
    const res = await request.get(`${getApiBaseUrl()}/student/profile`);
    expect(res.status()).toBe(401);
  });
});

test.describe("API: Teacher Endpoints (auth required)", () => {
  let teacherToken: string | null = null;

  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${getApiBaseUrl()}/auth/login-elearning`, {
      data: {
        identifier: process.env.TEACHER_USER || "teacher.test@stuudi.id",
        password: process.env.TEACHER_PASSWORD || "Test1234!",
        device_info: "playwright-api-test",
      },
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok()) {
      const body = await res.json();
      teacherToken = body.data?.token || body.token;
    }
  });

  test("GET /teacher/courses returns teacher's courses", async ({ request }) => {
    if (!teacherToken) test.skip();
    const res = await request.get(`${getApiBaseUrl()}/teacher/courses`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    expect(res.status()).toBe(200);
  });

  test("GET /teacher/participants returns participants list", async ({ request }) => {
    if (!teacherToken) test.skip();
    const res = await request.get(`${getApiBaseUrl()}/teacher/participants`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    expect(res.status()).toBe(200);
  });

  test("Teacher endpoint rejects student token (role check)", async ({ request }) => {
    // Get student token
    const studentRes = await request.post(`${getApiBaseUrl()}/auth/login-elearning`, {
      data: {
        identifier: process.env.STUDENT_USER || "student.test@stuudi.id",
        password: process.env.STUDENT_PASSWORD || "Test1234!",
        device_info: "playwright",
      },
      headers: { "Content-Type": "application/json" },
    });
    if (!studentRes.ok()) test.skip();
    const studentBody = await studentRes.json();
    const studentToken = studentBody.data?.token || studentBody.token;

    // Try teacher endpoint with student token
    const res = await request.get(`${getApiBaseUrl()}/teacher/courses`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    expect([403, 401]).toContain(res.status());
  });
});

test.describe("API: Student Endpoints (auth required)", () => {
  let studentToken: string | null = null;

  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${getApiBaseUrl()}/auth/login-elearning`, {
      data: {
        identifier: process.env.STUDENT_USER || "student.test@stuudi.id",
        password: process.env.STUDENT_PASSWORD || "Test1234!",
        device_info: "playwright-api-test",
      },
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok()) {
      const body = await res.json();
      studentToken = body.data?.token || body.token;
    }
  });

  test("GET /student/profile returns user profile", async ({ request }) => {
    if (!studentToken) test.skip();
    const res = await request.get(`${getApiBaseUrl()}/student/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    expect(res.status()).toBe(200);
  });

  test("GET /student/courses returns enrolled courses", async ({ request }) => {
    if (!studentToken) test.skip();
    const res = await request.get(`${getApiBaseUrl()}/student/courses`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    expect(res.status()).toBe(200);
  });

  test("GET /student/notifications returns notifications", async ({ request }) => {
    if (!studentToken) test.skip();
    const res = await request.get(`${getApiBaseUrl()}/student/notifications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    expect(res.status()).toBe(200);
  });

  test("GET /student/exams-attempts returns exam attempts", async ({ request }) => {
    if (!studentToken) test.skip();
    const res = await request.get(`${getApiBaseUrl()}/student/exams-attempts`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    expect(res.status()).toBe(200);
  });

  test("POST /student/enroll with invalid code returns 400/404", async ({ request }) => {
    if (!studentToken) test.skip();
    const res = await request.post(`${getApiBaseUrl()}/student/enroll`, {
      data: { enrollment_code: "XXXXXX" },
      headers: {
        Authorization: `Bearer ${studentToken}`,
        "Content-Type": "application/json",
      },
    });
    expect([400, 404, 422]).toContain(res.status());
  });
});