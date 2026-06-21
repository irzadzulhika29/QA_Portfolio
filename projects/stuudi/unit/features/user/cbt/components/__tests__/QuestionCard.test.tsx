import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestionCard } from "../QuestionCard";

describe("QuestionCard", () => {
  it("renders without crashing when question options are missing", () => {
    render(
      <QuestionCard
        question={
          {
            question_id: "matching-q",
            question_text: "Match the items",
            question_type: "matching",
            points: 1,
            options: undefined,
          } as never
        }
        selectedAnswer={null}
        onSelectAnswer={() => {}}
        onClearAnswer={() => {}}
      />
    );

    expect(screen.getByText("Match the items")).toBeInTheDocument();
  });
});
