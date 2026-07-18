import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NewPasswordForm } from "./NewPasswordForm";

describe("NewPasswordForm", () => {
  it("matches the designed challenge and invalid confirmation states", () => {
    render(
      <NewPasswordForm
        challenge={{ email: "learner@example.com", session: "challenge" }}
        onAuthenticated={vi.fn()}
      />,
    );

    expect(screen.getByText("Choose a new password")).toBeTruthy();
    expect(screen.getByText(/temporary password/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("New password"), {
      target: { value: "Permanent-password-1!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "different-password" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /set password/i }).closest("form")!);

    expect(screen.getByText("Passwords don't match.")).toBeTruthy();
    expect(screen.getByLabelText("Confirm password").getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("At least 12 characters").className).toContain("text-success");
  });
});
