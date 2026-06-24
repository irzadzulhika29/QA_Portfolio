import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "../Button";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("Button", () => {
  it("renders a native disabled button when disabled is true", () => {
    render(<Button disabled>Simpan</Button>);

    expect(screen.getByRole("button", { name: "Simpan" })).toBeDisabled();
  });

  it("renders an interactive link when href is provided", () => {
    render(<Button href="/dashboard">Ke Dashboard</Button>);

    expect(screen.getByRole("link", { name: "Ke Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  it("does not render an interactive link when href button is disabled", () => {
    render(
      <Button href="/dashboard" disabled>
        Ke Dashboard
      </Button>
    );

    expect(screen.queryByRole("link", { name: "Ke Dashboard" })).not.toBeInTheDocument();
    expect(screen.getByText("Ke Dashboard").closest("span")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
});
