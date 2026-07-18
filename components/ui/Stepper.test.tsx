import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from "./Stepper";

const steps = ["Parameters", "Prompt", "Import"];

describe("Stepper", () => {
  it("marks done steps with a check and upcoming ones with their number", () => {
    render(<Stepper steps={steps} current={1} />);
    const parameters = screen.getByRole("button", { name: /Parameters/ });
    expect(parameters.textContent).toContain("✓");
    const importStep = screen.getByRole("button", { name: /Import/ });
    expect(importStep.textContent).toContain("3");
  });

  it("exposes the current step via aria-current", () => {
    render(<Stepper steps={steps} current={1} />);
    expect(
      screen
        .getByRole("button", { name: /Prompt/ })
        .getAttribute("aria-current"),
    ).toBe("step");
  });

  it("is inert without onStepSelect and clickable with it", () => {
    const { rerender } = render(<Stepper steps={steps} current={0} />);
    const inert = screen.getByRole("button", { name: /Prompt/ });
    expect((inert as HTMLButtonElement).disabled).toBe(true);

    const onStepSelect = vi.fn();
    rerender(
      <Stepper steps={steps} current={0} onStepSelect={onStepSelect} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Import/ }));
    expect(onStepSelect).toHaveBeenCalledWith(2);
  });
});
