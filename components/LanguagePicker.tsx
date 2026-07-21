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

const SCRIPT_FONT: Record<LanguageCode, string> = {
  ja: "font-jp-serif",
  my: "font-myanmar",
  pl: "font-serif",
};

type LanguagePickerProps = {
  value: LanguageCode;
  onSelect: (option: LanguageOption) => void;
};

export function LanguagePicker({ value, onSelect }: LanguagePickerProps) {
  return (
    <fieldset>
      <legend className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-3 uppercase">
        Language
      </legend>
      <div className="grid grid-cols-3 gap-3">
        {LANGUAGES.map((option) => (
          <OptionCard
            className="flex flex-col items-center gap-1.5 px-2 py-5 text-center"
            key={option.code}
            onClick={() => onSelect(option)}
            selected={value === option.code}
          >
            <span
              className={cn(
                "block text-2xl leading-snug sm:text-[28px]",
                SCRIPT_FONT[option.code],
                LANGUAGE_TEXT[option.tone],
              )}
            >
              {option.nativeName}
            </span>
            <span className="block text-xs font-[540] text-ink-2">
              {option.englishName}
            </span>
          </OptionCard>
        ))}
      </div>
    </fieldset>
  );
}
