import type { ComponentProps, ReactNode } from "react";

export type RubyProps = ComponentProps<"ruby"> & {
  reading: ReactNode;
};

export function Ruby({ reading, children, ...props }: RubyProps) {
  return (
    <ruby {...props}>
      {children}
      <rt>{reading}</rt>
    </ruby>
  );
}
