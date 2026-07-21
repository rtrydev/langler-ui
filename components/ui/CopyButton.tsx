"use client";

import { useEffect, useRef, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/Button";

export type CopyButtonProps = Omit<ButtonProps, "onClick"> & {
  text: string;
  copiedLabel?: string;
};

export function CopyButton({
  text,
  copiedLabel = "Copied",
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      aria-live="polite"
      onClick={copy}
      {...props}
    >
      {copied ? copiedLabel : children}
    </Button>
  );
}
