import { describe, expect, it } from "vitest";
import { countAnsweredQuestions, hasMeaningfulAnswer } from "../answerState";

describe("answerState", () => {
  it("treats nullish and empty values as unanswered", () => {
    expect(hasMeaningfulAnswer(undefined)).toBe(false);
    expect(hasMeaningfulAnswer(null)).toBe(false);
    expect(hasMeaningfulAnswer("")).toBe(false);
    expect(hasMeaningfulAnswer("   ")).toBe(false);
    expect(hasMeaningfulAnswer([])).toBe(false);
    expect(hasMeaningfulAnswer({})).toBe(false);
  });

  it("treats actual selections as answered", () => {
    expect(hasMeaningfulAnswer("option-a")).toBe(true);
    expect(hasMeaningfulAnswer(["option-a"])).toBe(true);
    expect(hasMeaningfulAnswer({ leftA: "rightB" })).toBe(true);
  });

  it("counts only meaningful answers", () => {
    expect(
      countAnsweredQuestions({
        q1: null,
        q2: "option-a",
        q3: {},
        q4: ["option-b"],
      })
    ).toBe(2);
  });
});
