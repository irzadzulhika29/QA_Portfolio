import type { APIRequestContext } from "@playwright/test";

/**
 * Test fixtures & helpers for Stuudi (Arteri)
 */

export const TEST_USERS = {
  student: {
    identifier: process.env.STUDENT_USER || "student.test@stuudi.id",
    password: process.env.STUDENT_PASSWORD || "Test1234!",
    role: "student",
  },
  teacher: {
    identifier: process.env.TEACHER_USER || "teacher.test@stuudi.id",
    password: process.env.TEACHER_PASSWORD || "Test1234!",
    role: "teacher",
  },
  invalid: {
    identifier: "nonexistent@invalid.test",
    password: "wrongPassword123",
  },
} as const;

export const ROUTES = {
  login: "/login",
  studentDashboard: "/dashboard",
  adminDashboard: "/dashboard-admin",
  courses: "/courses",
  team: "/team",
  cbtCheck: "/cbt/check",
  cbtExam: "/cbt/exam",
} as const;

/**
 * Login helper used across most E2E tests
 */
export async function login(
  page: import("@playwright/test").Page,
  user: { identifier: string; password: string },
) {
  await page.goto(ROUTES.login);
  await page.fill('input#identifier', user.identifier);
  await page.fill('input#password', user.password);
  await page.click('button[type="submit"]');
}

/**
 * API base URL helper (separate from frontend baseURL)
 */
export function getApiBaseUrl(): string {
  return process.env.API_BASE_URL || "http://localhost:8080/api/v1";
}

/**
 * Login via API and return JWT token (for setup that doesn't need UI)
 */
export async function loginViaApi(
  request: APIRequestContext,
  identifier: string,
  password: string,
): Promise<string> {
  const res = await request.post(`${getApiBaseUrl()}/auth/login-elearning`, {
    data: { identifier, password, device_info: "playwright-e2e" },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    throw new Error(`Login API failed: ${res.status()} ${await res.text()}`);
  }
  const body = await res.json();
  return body.data?.token || body.token;
}