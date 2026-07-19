import { OptionCard } from "@/components/ui/OptionCard";
import { cn } from "@/lib/cn";
import {
  LANGUAGES,
  type LanguageCode,
  type LanguageOption,
} from "@/lib/lesson-catalog";

const LANGUAGE_TEXT: Record<LanguageOption["tone"], string> = {
  vermilion: "text-vermilion",
  gold: "text-gold",
  crimson: "text-crimson",
};

type LanguagePickerProps = {
  value: LanguageCode;
  onSelect: (option: LanguageOption) => void;
};

export function LanguagePicker({ value, onSelect }: LanguagePickerProps) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[13px] font-semibold">Language</legend>
      <div className="grid grid-cols-3 gap-3">
        {LANGUAGES.map((option) => (
          <OptionCard
            className="px-2 py-4 text-center"
            key={option.code}
            onClick={() => onSelect(option)}
            selected={value === option.code}
          >
            <span
              className={cn(
                "block text-2xl leading-snug sm:text-[28px]",
                option.code === "ja" && "font-jp-serif",
                option.code === "my" && "font-myanmar",
                LANGUAGE_TEXT[option.tone],
              )}
            >
              {option.nativeName}
            </span>
            <span className="mt-1.5 block text-xs text-ink-2">
              {option.englishName}
            </span>
          </OptionCard>
        ))}
      </div>
    </fieldset>
  );
}
