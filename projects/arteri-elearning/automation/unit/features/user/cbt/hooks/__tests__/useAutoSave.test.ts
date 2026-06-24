import { renderHook, act, waitFor } from "@testing-library/react";
import { useAutoSave } from "../useAutoSave";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as reduxHooks from "@/shared/store/hooks";
import { examService } from "../../services/examService";

// Mock dependencies
vi.mock("@/shared/store/hooks", () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock("../../services/examService", () => ({
  examService: {
    saveAnswer: vi.fn(),
    clearAnswer: vi.fn(),
  },
}));

// Mock useDebounce to return value immediately for testing
vi.mock("@/shared/hooks/useDebounce", () => ({
  useDebounce: <T>(value: T) => value,
}));

describe("useAutoSave", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (reduxHooks.useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (examService.saveAnswer as Mock).mockResolvedValue(true);
    (examService.clearAnswer as Mock).mockResolvedValue(true);
  });

  it("should dispatch setAnswer immediately (Optimistic UI)", async () => {
    const { result } = renderHook(() => useAutoSave({ attemptId: "123" }));

    act(() => {
      result.current.saveAnswer("q1", "A");
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { questionId: "q1", answer: "A" },
      })
    );

    await waitFor(() => {
      expect(examService.saveAnswer).toHaveBeenCalledWith("123", "q1", "A");
    });
  });

  it("should call saveAnswer API after update", async () => {
    const { result } = renderHook(() => useAutoSave({ attemptId: "123" }));

    act(() => {
      result.current.saveAnswer("q1", "A");
    });

    // Wait for the effect to trigger service call
    await waitFor(() => {
      expect(examService.saveAnswer).toHaveBeenCalledWith("123", "q1", "A");
    });
  });

  it("should call clearAnswer API when answer is null", async () => {
    const { result } = renderHook(() => useAutoSave({ attemptId: "123" }));

    act(() => {
      result.current.saveAnswer("q1", null);
    });

    await waitFor(() => {
      expect(examService.clearAnswer).toHaveBeenCalledWith("123", "q1");
    });
  });
});
