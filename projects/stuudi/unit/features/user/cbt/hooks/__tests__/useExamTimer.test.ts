import { renderHook, act } from "@testing-library/react";
import { useExamTimer } from "../useExamTimer";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as reduxHooks from "@/shared/store/hooks";
import * as examSlice from "@/shared/store/slices/examSlice";

// Mock Redux hooks
vi.mock("@/shared/store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

// Mock Exam Slice actions
vi.mock("@/shared/store/slices/examSlice", () => ({
  decrementTime: vi.fn(),
}));

describe("useExamTimer", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (reduxHooks.useAppDispatch as Mock).mockReturnValue(mockDispatch);
  });

  it("should return initial time", () => {
    (reduxHooks.useAppSelector as Mock).mockReturnValue({
      timeRemaining: 3600,
      lives: 3,
      view: "exam",
    });

    const { result } = renderHook(() => useExamTimer());

    expect(result.current.timeRemaining).toBe(3600);
    expect(result.current.formattedTime.formatted).toBe("01:00:00");
  });

  it("should decrement time when exam is active", () => {
    vi.useFakeTimers();
    (reduxHooks.useAppSelector as Mock).mockReturnValue({
      timeRemaining: 3600,
      lives: 3,
      view: "exam",
    });

    renderHook(() => useExamTimer());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(examSlice.decrementTime).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("should NOT decrement time when lives are 0", () => {
    vi.useFakeTimers();
    (reduxHooks.useAppSelector as Mock).mockReturnValue({
      timeRemaining: 3600,
      lives: 0,
      view: "exam",
    });

    renderHook(() => useExamTimer());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
