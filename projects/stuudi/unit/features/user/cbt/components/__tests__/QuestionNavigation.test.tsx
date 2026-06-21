import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionNavigation } from "../QuestionNavigation";

describe("QuestionNavigation", () => {
  it("keeps answered questions filled when the current item is selected", () => {
    render(
      <QuestionNavigation
        questions={[
          {
            question_id: "q-1",
            question_text: "Question 1",
            question_type: "single",
            points: 1,
            options: [],
          },
          {
            question_id: "q-2",
            question_text: "Question 2",
            question_type: "single",
            points: 1,
            options: [],
          },
        ]}
        currentIndex={0}
        answers={{ "q-1": "option-1" }}
        flaggedQuestions={new Set<string>()}
        isFlagged={false}
        onNavigate={() => {}}
        onToggleFlag={() => {}}
      />
    );

    const firstButton = screen.getByRole("button", { name: "1" });
    expect(firstButton.className).toContain("bg-primary");
    expect(firstButton.className).toContain("ring-2");
  });

  it("toggles the compact flag action from the icon button", () => {
    const onToggleFlag = vi.fn();

    render(
      <QuestionNavigation
        questions={[
          {
            question_id: "q-1",
            question_text: "Question 1",
            question_type: "single",
            points: 1,
            options: [],
          },
        ]}
        currentIndex={0}
        answers={{}}
        flaggedQuestions={new Set<string>()}
        isFlagged={false}
        onNavigate={() => {}}
        onToggleFlag={onToggleFlag}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Tandai soal" }));
    expect(onToggleFlag).toHaveBeenCalledTimes(1);
  });
});
