import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders its content in a pre", () => {
    const { container } = render(<CodeBlock>npx langler init</CodeBlock>);
    const pre = container.querySelector("pre");
    expect(pre?.textContent).toBe("npx langler init");
  });

  it("omits the header when there is no title or actions", () => {
    const { container } = render(<CodeBlock>x</CodeBlock>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild?.tagName).toBe("PRE");
  });

  it("renders the header with title and actions", () => {
    render(
      <CodeBlock
        title="generated-prompt.md"
        actions={<button type="button">Copy prompt</button>}
      >
        You are generating a lesson.
      </CodeBlock>,
    );
    expect(screen.getByText("generated-prompt.md")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy prompt" })).toBeTruthy();
  });
});
