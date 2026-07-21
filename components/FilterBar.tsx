import type { ReactNode } from "react";
import { Pill, type PillTone } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";

export type FilterLanguage = {
  value: string;
  label: ReactNode;
  tone?: PillTone;
};

export type FilterBarProps = {
  languages?: FilterLanguage[];
  activeLanguage?: string;
  onLanguageChange?: (value: string) => void;
  allLabel?: string;
  children?: ReactNode;
  className?: string;
};

export function FilterBar({
  languages = [],
  activeLanguage = "",
  onLanguageChange,
  allLabel = "All languages",
  children,
  className,
}: FilterBarProps) {
  const showLanguages = languages.length > 1;
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center gap-2 border-b border-line pb-4",
        className,
      )}
    >
      {showLanguages && (
        <>
          <Pill
            onClick={() => onLanguageChange?.("")}
            selected={activeLanguage === ""}
          >
            {allLabel}
          </Pill>
          {languages.map((language) => (
            <Pill
              key={language.value}
              onClick={() => onLanguageChange?.(language.value)}
              selected={activeLanguage === language.value}
              tone={language.tone}
            >
              {language.label}
            </Pill>
          ))}
        </>
      )}
      {children && (
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {children}
        </div>
      )}
    </div>
  );
}
