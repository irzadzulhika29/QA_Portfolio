import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExamSummary } from "../ExamSummary";

describe("ExamSummary", () => {
  it("renders stored answers using option text previews", () => {
    render(
      <ExamSummary
        questions={[
          {
            question_id: "single-q",
            question_text: "Ibu kota Indonesia?",
            question_type: "single",
            points: 1,
            options: [
              {
                option_id: "jakarta",
                option_text: "Jakarta",
                sequence: 1,
              },
            ],
          },
          {
            question_id: "empty-q",
            question_text: "Belum dijawab",
            question_type: "single",
            points: 1,
            options: [],
          },
        ]}
        answers={{ "single-q": "jakarta" }}
        flaggedQuestions={[]}
        onNavigateToQuestion={vi.fn()}
        onBackToExam={vi.fn()}
        onConfirmSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Jakarta")).toBeInTheDocument();
    expect(screen.getAllByText("Belum dijawab").length).toBeGreaterThan(0);
  });
});
