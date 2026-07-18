import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type DownloadLinkProps = Omit<ComponentProps<"a">, "download" | "href"> & {
  content: string;
  fileName: string;
  mediaType?: string;
};

export function DownloadLink({
  content,
  fileName,
  mediaType = "text/plain",
  className,
  ...props
}: DownloadLinkProps) {
  const href = `data:${mediaType};charset=utf-8,${encodeURIComponent(content)}`;
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[7px] border border-accent-border px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
      download={fileName}
      href={href}
      {...props}
    />
  );
}
