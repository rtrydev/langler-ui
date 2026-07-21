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
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-sm border border-line bg-surface px-3 text-[13px] font-[540] text-ink shadow-card transition-all duration-150",
        "hover:-translate-y-px hover:border-ink-3 hover:bg-tint focus-visible:shadow-ring focus-visible:outline-none",
        className,
      )}
      download={fileName}
      href={href}
      {...props}
    />
  );
}
