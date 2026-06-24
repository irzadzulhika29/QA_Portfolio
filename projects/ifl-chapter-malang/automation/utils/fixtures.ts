import { test as base } from "@playwright/test";

/**
 * IFL Chapter Malang test fixtures
 * Base URLs for FE and BE
 */
export const IFL_BE_URL = "https://api.iflchaptermalang.org/api/v1";
export const IFL_FE_URL = "https://iflchaptermalang.org";

/**
 * Test users — gunakan credentials dummy/test
 * Ganti sesuai data test di database
 */
export const TEST_USERS = {
  visitor: { email: "", password: "" }, // anonymous
  volunteer: { email: "volunteer@test.com", password: "password123" },
  admin: { email: "admin@iflchaptermalang.org", password: "password123" },
};

export const test = base;
export { expect } from "@playwright/test";
