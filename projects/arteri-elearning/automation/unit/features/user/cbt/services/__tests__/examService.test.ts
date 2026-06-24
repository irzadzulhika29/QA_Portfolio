import { beforeEach, describe, expect, it, vi } from "vitest";
import { examService } from "../examService";
import { api } from "@/shared/api/api";

vi.mock("@/shared/api/api", () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("examService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("hydrates saved answers from resume payload into UI-friendly shapes", () => {
    const payload = examService.transformExamToReduxPayload({
      attempt_id: "attempt-1",
      exam_id: "exam-1",
      title: "Exam",
      duration: 120,
      started_at: "2026-01-26T11:23:38Z",
      ends_at: "2026-01-26T13:23:38Z",
      time_remaining: 5519,
      lives_info: {
        is_disqualified: false,
        lives_remaining: 3,
        tab_switches: 0,
      },
      questions: [
        {
          question_id: "matching-q",
          question_text: "Match items",
          question_type: "matching",
          points: 1,
          sequence: 1,
          options: [
            {
              option_id: "left-1",
              option_text: "Python",
              side: "left",
              matching_pair: "pair-1",
              sequence: 1,
            },
            {
              option_id: "right-1",
              option_text: "Data Science",
              side: "right",
              matching_pair: "pair-1",
              sequence: 2,
            },
            {
              option_id: "left-2",
              option_text: "Kotlin",
              side: "left",
              matching_pair: "pair-2",
              sequence: 3,
            },
            {
              option_id: "right-2",
              option_text: "Android",
              side: "right",
              matching_pair: "pair-2",
              sequence: 4,
            },
          ],
          saved_answer: ["left-1", "right-1", "left-2", "right-2"],
        },
        {
          question_id: "multiple-q",
          question_text: "Multiple",
          question_type: "multiple",
          points: 1,
          sequence: 2,
          options: [],
          saved_answer: ["multi-1", "multi-2"],
        },
        {
          question_id: "single-q",
          question_text: "Single",
          question_type: "single",
          points: 1,
          sequence: 3,
          options: [],
          saved_answer: ["single-1"],
        },
      ],
    });

    expect(payload.initialAnswers).toEqual({
      "matching-q": {
        "left-1": "right-1",
        "left-2": "right-2",
      },
      "multiple-q": ["multi-1", "multi-2"],
      "single-q": "single-1",
    });
  });

  it("serializes matching answers into the selected_option_id array expected by the API", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {} });

    await examService.saveAnswer("attempt-1", "matching-q", {
      "left-1": "right-1",
      "left-2": "right-2",
    });

    expect(api.post).toHaveBeenCalledWith("/student/exams-attempt/attempt-1/answers", {
      question_id: "matching-q",
      selected_option_id: ["left-1", "right-1", "left-2", "right-2"],
    });
  });

  it("defaults missing question options to an empty array when hydrating exam data", () => {
    const payload = examService.transformExamToReduxPayload({
      attempt_id: "attempt-1",
      exam_id: "exam-1",
      title: "Exam",
      duration: 120,
      started_at: "2026-01-26T11:23:38Z",
      ends_at: "2026-01-26T13:23:38Z",
      time_remaining: 5519,
      lives_info: {
        is_disqualified: false,
        lives_remaining: 3,
        tab_switches: 0,
      },
      questions: [
        {
          question_id: "matching-q",
          question_text: "Match items",
          question_type: "matching",
          points: 1,
          sequence: 1,
          options: undefined as never,
          saved_answer: null,
        },
      ],
    });

    expect(payload.examData.questions[0]?.options).toEqual([]);
  });

  it("infers matching option sides from matching_pair and sequence when side metadata is missing", () => {
    const payload = examService.transformExamToReduxPayload({
      attempt_id: "attempt-1",
      exam_id: "exam-1",
      title: "Exam",
      duration: 120,
      started_at: "2026-01-26T11:23:38Z",
      ends_at: "2026-01-26T13:23:38Z",
      time_remaining: 5519,
      lives_info: {
        is_disqualified: false,
        lives_remaining: 3,
        tab_switches: 0,
      },
      questions: [
        {
          question_id: "matching-q",
          question_text: "Match items",
          question_type: "matching",
          points: 1,
          sequence: 1,
          options: [
            {
              option_id: "right-1",
              option_text: "Web Development",
              side: "RIGHT " as never,
              matching_pair: "pair-1",
              sequence: 2,
            },
            {
              option_id: "left-1",
              option_text: "JavaScript",
              side: null as never,
              matching_pair: "pair-1",
              sequence: 1,
            },
            {
              option_id: "right-2",
              option_text: "Android",
              side: undefined as never,
              matching_pair: "pair-2",
              sequence: 4,
            },
            {
              option_id: "left-2",
              option_text: "Kotlin",
              side: " left" as never,
              matching_pair: "pair-2",
              sequence: 3,
            },
          ],
          saved_answer: ["left-1", "right-1", "left-2", "right-2"],
        },
      ],
    });

    expect(payload.examData.questions[0]?.options).toEqual([
      expect.objectContaining({
        option_id: "right-1",
        side: "right",
      }),
      expect.objectContaining({
        option_id: "left-1",
        side: "left",
      }),
      expect.objectContaining({
        option_id: "right-2",
        side: "right",
      }),
      expect.objectContaining({
        option_id: "left-2",
        side: "left",
      }),
    ]);

    expect(payload.initialAnswers["matching-q"]).toEqual({
      "left-1": "right-1",
      "left-2": "right-2",
    });
  });

  it("hydrates start payload with matching options intact for the first exam load", () => {
    const payload = examService.transformStartExamToReduxPayload({
      attempt_id: "attempt-1",
      exam_id: "exam-1",
      title: "Exam",
      duration: 120,
      started_at: "2026-01-26T11:23:38Z",
      ends_at: "2026-01-26T13:23:38Z",
      lives_info: {
        is_disqualified: false,
        lives_remaining: 3,
        tab_switches: 0,
      },
      questions: [
        {
          question_id: "matching-q",
          question_text: "TESS MATCHING",
          question_type: "matching",
          points: 4,
          sequence: 1,
          image_url: null,
          options: [
            {
              option_id: "72a88925-745a-4dca-90fb-95445391dd7f",
              option_text: "adaaa",
              side: "right",
              matching_pair: "59d4446a-3edb-4e60-af34-e0fdf059ac02",
              sequence: 2,
            },
            {
              option_id: "761bb4b9-80b2-4db4-9ccc-0cd57748f913",
              option_text: "ada",
              side: "left",
              matching_pair: "a7d21858-9d0c-44b6-a75b-763114c5667b",
              sequence: 1,
            },
            {
              option_id: "b78b78c6-34b4-4a66-8b80-6108c1205d98",
              option_text: "adaaa",
              side: "left",
              matching_pair: "59d4446a-3edb-4e60-af34-e0fdf059ac02",
              sequence: 2,
            },
            {
              option_id: "e7522762-4425-4069-9884-240385a3b696",
              option_text: "ada",
              side: "right",
              matching_pair: "a7d21858-9d0c-44b6-a75b-763114c5667b",
              sequence: 1,
            },
          ],
        },
      ],
    });

    expect(payload.examData.questions[0]?.options).toHaveLength(4);
    expect(payload.examData.questions[0]?.question_text).toBe("TESS MATCHING");
    expect(payload.examData.questions[0]?.options).toEqual([
      expect.objectContaining({
        option_id: "72a88925-745a-4dca-90fb-95445391dd7f",
        side: "right",
      }),
      expect.objectContaining({
        option_id: "761bb4b9-80b2-4db4-9ccc-0cd57748f913",
        side: "left",
      }),
      expect.objectContaining({
        option_id: "b78b78c6-34b4-4a66-8b80-6108c1205d98",
        side: "left",
      }),
      expect.objectContaining({
        option_id: "e7522762-4425-4069-9884-240385a3b696",
        side: "right",
      }),
    ]);
  });

  it("restores missing matching options on resume from the cached start snapshot", () => {
    examService.cacheAttemptQuestionSnapshot({
      attempt_id: "attempt-1",
      exam_id: "exam-1",
      title: "Exam",
      duration: 120,
      started_at: "2026-01-26T11:23:38Z",
      ends_at: "2026-01-26T13:23:38Z",
      lives_info: {
        is_disqualified: false,
        lives_remaining: 3,
        tab_switches: 0,
      },
      questions: [
        {
          question_id: "matching-q",
          question_text: "Match items",
          question_type: "matching",
          points: 4,
          sequence: 1,
          options: [
            {
              option_id: "left-1",
              option_text: "D",
              side: "left",
              matching_pair: "pair-1",
              sequence: 1,
            },
            {
              option_id: "right-1",
              option_text: "DD",
              side: "right",
              matching_pair: "pair-1",
              sequence: 1,
            },
            {
              option_id: "left-2",
              option_text: "E",
              side: "left",
              matching_pair: "pair-2",
              sequence: 2,
            },
            {
              option_id: "right-2",
              option_text: "EE",
              side: "right",
              matching_pair: "pair-2",
              sequence: 2,
            },
          ],
        },
      ],
    });

    const payload = examService.transformExamToReduxPayload({
      attempt_id: "attempt-1",
      exam_id: "exam-1",
      title: "Exam",
      duration: 120,
      started_at: "2026-01-26T11:23:38Z",
      ends_at: "2026-01-26T13:23:38Z",
      time_remaining: 5519,
      lives_info: {
        is_disqualified: false,
        lives_remaining: 3,
        tab_switches: 0,
      },
      questions: [
        {
          question_id: "matching-q",
          question_text: "Match items",
          question_type: "matching",
          points: 4,
          sequence: 1,
          options: [],
          saved_answer: ["left-1", "right-1"],
        },
      ],
    });

    expect(payload.examData.questions[0]?.options).toHaveLength(4);
    expect(payload.examData.questions[0]?.options).toEqual([
      expect.objectContaining({ option_id: "left-1", side: "left" }),
      expect.objectContaining({ option_id: "right-1", side: "right" }),
      expect.objectContaining({ option_id: "left-2", side: "left" }),
      expect.objectContaining({ option_id: "right-2", side: "right" }),
    ]);
    expect(payload.initialAnswers["matching-q"]).toEqual({
      "left-1": "right-1",
    });
  });

  it("submits the current attempt to the submit endpoint", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        status: {
          code: 200,
          isSuccess: true,
        },
        message: "exam submitted",
        data: {
          saved: true,
        },
      },
    });

    const response = await examService.submitExam("attempt-1");

    expect(api.post).toHaveBeenCalledWith("/student/exams-attempt/attempt-1/submit");
    expect(response).toEqual({
      status: {
        code: 200,
        isSuccess: true,
      },
      message: "exam submitted",
      data: {
        saved: true,
      },
    });
  });
});
