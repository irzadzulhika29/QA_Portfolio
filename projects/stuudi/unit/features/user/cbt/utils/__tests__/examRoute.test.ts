import { describe, expect, it } from "vitest";
import { buildExamRoute, canReuseLoadedExam, resolveExamLookup } from "../examRoute";

describe("examRoute", () => {
  it("builds exam route from access code", () => {
    expect(buildExamRoute({ examCode: "ABC123" })).toBe("/cbt/exam?code=ABC123");
  });

  it("builds exam route from exam id when resuming attempt", () => {
    expect(buildExamRoute({ examId: "exam-123" })).toBe("/cbt/exam?examId=exam-123");
  });

  it("resolves exam lookup by exam id before exam code", () => {
    expect(resolveExamLookup({ examCode: "ABC123", examId: "exam-123" })).toEqual({
      type: "examId",
      value: "exam-123",
    });
  });

  it("returns null when no identifier is available", () => {
    expect(resolveExamLookup({ examCode: null, examId: null })).toBeNull();
  });

  it("reuses initialized exam only when route is based on the same exam id", () => {
    expect(
      canReuseLoadedExam({
        requestedExamId: "exam-123",
        loadedExamId: "exam-123",
        isInitialized: true,
        questionCount: 3,
      })
    ).toBe(true);
  });

  it("does not reuse initialized exam for code-based routes", () => {
    expect(
      canReuseLoadedExam({
        requestedExamId: null,
        loadedExamId: "exam-123",
        isInitialized: true,
        questionCount: 3,
      })
    ).toBe(false);
  });
});
