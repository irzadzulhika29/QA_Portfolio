import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExamFooter } from "../ExamFooter";

describe("ExamFooter", () => {
  it("routes the primary action to finish on the last question", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const onFinishAttempt = vi.fn();

    render(
      <ExamFooter
        currentIndex={4}
        totalQuestions={5}
        onPrevious={onPrevious}
        onNext={onNext}
        onFinishAttempt={onFinishAttempt}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Selesai ujian" }));

    expect(onFinishAttempt).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });
});
