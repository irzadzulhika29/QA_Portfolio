import { describe, expect, it } from "vitest";
import { getMultipartRequestConfig } from "../multipartRequest";

describe("getMultipartRequestConfig", () => {
  it("does not set Content-Type explicitly for FormData requests", () => {
    expect(getMultipartRequestConfig()).toBeUndefined();
  });
});
