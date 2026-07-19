import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ParametersStep } from "./ParametersStep";
import type { WizardParams } from "./CreateLessonWizard";

const params: WizardParams = {
  language: "pl",
  level: "A1",
  topic: "",
  topicSlug: "",
  length: "standard",
  exerciseTypes: ["multiple_choice"],
  foundational: false,
  includeReference: true,
};

describe("ParametersStep topics", () => {
  it("selects a suggested topic chip with its curated slug", () => {
    const onChange = vi.fn();
    render(
      <ParametersStep
        error=""
        estimatedLevels={{}}
        onChange={onChange}
        onNext={vi.fn()}
        params={params}
        topics={[
          {
            slug: "food-drink",
            name: "Food & drink",
            description: "Meals and cooking",
            wordCount: 41,
            coveredCount: 12,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("group", { name: /Suggested topics/i }),
    ).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: /Food & drink12\/41 learned/i }),
    );

    expect(onChange).toHaveBeenCalledWith({
      ...params,
      topic: "Food & drink",
      topicSlug: "food-drink",
    });
  });

  it("clears a curated slug when the learner enters a custom topic", () => {
    const onChange = vi.fn();
    render(
      <ParametersStep
        error=""
        estimatedLevels={{}}
        onChange={onChange}
        onNext={vi.fn()}
        params={{ ...params, topic: "Food & drink", topicSlug: "food-drink" }}
        topics={[]}
      />,
    );

    fireEvent.change(screen.getByLabelText("Topic"), {
      target: { value: "A rainy weekend in Gdańsk" },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...params,
      topic: "A rainy weekend in Gdańsk",
      topicSlug: "",
    });
  });
});
