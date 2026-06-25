import { test as base } from "@playwright/test";

export const AC_BE_URL = process.env.PLAYWRIGHT_API_URL || "https://vps.akademicompetition.id";
export const AC_FE_URL = process.env.PLAYWRIGHT_BASE_URL || "https://akademicompetition.id";

export const TEST_USERS = {
  user: { email: "user@test.com", password: "password123" },
  admin: { email: "admin@akademicompetition.id", password: "password123" },
};

export const test = base;
export { expect } from "@playwright/test";
