import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChoiceChip } from "./ChoiceChip";

describe("ChoiceChip", () => {
  it("defaults to a radio input", () => {
    render(
      <ChoiceChip name="level" value="n4">
        N4
      </ChoiceChip>,
    );
    expect(screen.getByRole("radio")).toBeTruthy();
  });

  it("renders a checkbox with the check-mark affordance when multi-select", () => {
    render(
      <ChoiceChip type="checkbox" name="types" value="cloze">
        Cloze
      </ChoiceChip>,
    );
    expect(screen.getByRole("checkbox")).toBeTruthy();
    expect(screen.getByText("Cloze").className).toContain(
      "peer-checked:before:content-['✓']",
    );
  });

  it("omits the check mark for radios by default", () => {
    render(
      <ChoiceChip name="level" value="n4">
        N4
      </ChoiceChip>,
    );
    expect(screen.getByText("N4").className).not.toContain("✓");
  });

  it("toggles the underlying checkbox when the chip is clicked", () => {
    render(
      <ChoiceChip type="checkbox" name="types" value="cloze">
        Cloze
      </ChoiceChip>,
    );
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.checked).toBe(false);
    fireEvent.click(screen.getByText("Cloze"));
    expect(box.checked).toBe(true);
  });
});
