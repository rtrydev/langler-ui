import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldMessage } from "./FieldMessage";

describe("FieldMessage", () => {
  it("defaults to muted helper text", () => {
    render(<FieldMessage>At least 12 characters</FieldMessage>);
    expect(screen.getByText("At least 12 characters").className).toContain(
      "text-ink-3",
    );
  });

  it("colors error and success tones", () => {
    render(
      <FieldMessage tone="error">Passwords don&apos;t match.</FieldMessage>,
    );
    expect(
      screen.getByText("Passwords don't match.").className,
    ).toContain("text-vermilion");

    render(<FieldMessage tone="success">Looks good</FieldMessage>);
    expect(screen.getByText("Looks good").className).toContain(
      "text-success",
    );
  });
});
