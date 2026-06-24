import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import * as reduxHooks from "@/shared/store/hooks";
import { examService } from "../../services/examService";
import { useFullscreenGuard } from "../useFullscreenGuard";

vi.mock("@/shared/store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("../../services/examService", () => ({
  examService: {
    recordTabSwitch: vi.fn(),
  },
}));

describe("useFullscreenGuard", () => {
  const mockDispatch = vi.fn();
  let fullscreenElement: Element | null;

  beforeEach(() => {
    vi.resetAllMocks();
    fullscreenElement = null;

    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => fullscreenElement,
    });

    (reduxHooks.useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (reduxHooks.useAppSelector as Mock).mockReturnValue({
      view: "exam",
      examData: {
        attempt_id: "attempt-123",
      },
    });
  });

  it("shows the fullscreen overlay without recording a violation when user exits fullscreen", () => {
    const { result } = renderHook(() => useFullscreenGuard());

    act(() => {
      fullscreenElement = document.createElement("div");
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    act(() => {
      fullscreenElement = null;
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    expect(result.current.showOverlay).toBe(true);
    expect(examService.recordTabSwitch).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
