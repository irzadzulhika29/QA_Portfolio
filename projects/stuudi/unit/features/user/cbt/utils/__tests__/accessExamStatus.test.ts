import { describe, expect, it } from "vitest";
import { getExamAccessStatus } from "../accessExamStatus";
import { ExamAccessData } from "@/features/user/dashboard/types/dashboardTypes";

function createExamAccessData(overrides: Partial<ExamAccessData> = {}): ExamAccessData {
  return {
    exam_id: "exam-1",
    course_id: "course-1",
    course_name: "Course",
    title: "Exam Title",
    description: "Description",
    duration: 120,
    passing_score: 70,
    total_questions: 10,
    start_time: "2026-01-25T09:00:00Z",
    end_time: "2026-02-01T12:00:00Z",
    max_attempts: 2,
    attempts_used: 0,
    attempts_left: 2,
    can_start: true,
    message: "You can start the exam",
    ...overrides,
  };
}

describe("getExamAccessStatus", () => {
  it("marks exam as ready when backend allows start and attempts remain", () => {
    const status = getExamAccessStatus(createExamAccessData());

    expect(status.isEligible).toBe(true);
    expect(status.statusLabel).toBe("Siap Dimulai");
    expect(status.message).toBe("You can start the exam");
  });

  it("blocks start when backend disallows the exam", () => {
    const status = getExamAccessStatus(
      createExamAccessData({
        can_start: false,
        message: "Exam has not started yet",
      })
    );

    expect(status.isEligible).toBe(false);
    expect(status.statusLabel).toBe("Belum Bisa Dimulai");
    expect(status.message).toBe("Exam has not started yet");
  });

  it("blocks start when attempts are exhausted even if can_start is true", () => {
    const status = getExamAccessStatus(
      createExamAccessData({
        attempts_left: 0,
        attempts_used: 2,
        message: "No attempts left",
      })
    );

    expect(status.isEligible).toBe(false);
    expect(status.statusLabel).toBe("Belum Bisa Dimulai");
    expect(status.message).toBe("No attempts left");
  });
});
