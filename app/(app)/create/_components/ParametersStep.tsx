"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { OptionCard } from "@/components/ui/OptionCard";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";
import {
  EXERCISE_TYPES,
  LANGUAGES,
  LESSON_LENGTHS,
  type LanguageOption,
} from "@/lib/lesson-catalog";
import type { WizardParams } from "./CreateLessonWizard";

type ParametersStepProps = {
  params: WizardParams;
  error: string;
  onChange: (params: WizardParams) => void;
  onNext: () => void;
};

const LANGUAGE_TEXT: Record<LanguageOption["tone"], string> = {
  vermilion: "text-vermilion",
  gold: "text-gold",
  crimson: "text-crimson",
};

export function ParametersStep({
  params,
  error,
  onChange,
  onNext,
}: ParametersStepProps) {
  function selectLanguage(option: LanguageOption) {
    onChange({ ...params, language: option.code, level: option.levels[0] });
  }

  function toggleType(code: string) {
    const selected = params.exerciseTypes.includes(code);
    onChange({
      ...params,
      exerciseTypes: selected
        ? params.exerciseTypes.filter((type) => type !== code)
        : [...params.exerciseTypes, code],
    });
  }

  const language = LANGUAGES.find((option) => option.code === params.language);

  return (
    <div className="grid gap-6">
      <fieldset>
        <legend className="mb-2.5 text-[13px] font-semibold">Language</legend>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGES.map((option) => (
            <OptionCard
              className="px-2 py-4 text-center"
              key={option.code}
              onClick={() => selectLanguage(option)}
              selected={params.language === option.code}
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label className="mb-2.5 block text-[13px] font-semibold">
            Level
          </Label>
          <SegmentedControl
            name="level"
            onValueChange={(level) => onChange({ ...params, level })}
            options={(language?.levels ?? []).map((level) => ({
              value: level,
              label: level,
            }))}
            value={params.level}
          />
        </div>
        <div>
          <Label className="mb-2.5 block text-[13px] font-semibold">
            Lesson length
          </Label>
          <SegmentedControl
            name="length"
            onValueChange={(length) =>
              onChange({ ...params, length: length as WizardParams["length"] })
            }
            options={LESSON_LENGTHS.map((length) => ({
              value: length.code,
              label: length.label,
            }))}
            value={params.length}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2.5 block text-[13px] font-semibold" htmlFor="topic">
          Topic
        </Label>
        <Input
          id="topic"
          maxLength={120}
          onChange={(event) => onChange({ ...params, topic: event.target.value })}
          placeholder="Weekend travel — a trip to Kyoto"
          value={params.topic}
        />
      </div>

      <fieldset>
        <legend className="mb-2.5 text-[13px] font-semibold">
          Exercise types
        </legend>
        <div className="flex flex-wrap gap-2">
          {EXERCISE_TYPES.filter((type) => type.code !== "reading").map(
            (type) => (
              <ChoiceChip
                checked={params.exerciseTypes.includes(type.code)}
                key={type.code}
                name="exercise-types"
                onChange={() => toggleType(type.code)}
                type="checkbox"
              >
                {type.label}
              </ChoiceChip>
            ),
          )}
        </div>
        {error ? <FieldMessage tone="error">{error}</FieldMessage> : null}
      </fieldset>

      {params.foundational ? (
        <Card elevation="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13.5px] font-semibold">Foundational lesson</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
                This lesson focuses on script, words, and very short sentences.
                Connected reading begins once you can decode it.
              </p>
            </div>
            <Button
              onClick={() => onChange({ ...params, foundational: false })}
              size="sm"
              variant="secondary"
            >
              Include the story
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card elevation="card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-[13.5px] font-semibold">
                  Short story reading
                  <span className="rounded-[5px] bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                    INCLUDED
                  </span>
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
                  Ends the lesson with a short, level-appropriate story that
                  ties the new words and grammar together.
                </p>
              </div>
            </div>
          </Card>
          <p className="flex gap-2 text-xs leading-relaxed text-ink-3">
            <span aria-hidden className="text-accent">
              ⓘ
            </span>
            <span>
              Foundational lessons focus on script and short sentences —
              connected reading begins once you can decode it.{" "}
              <button
                className="cursor-pointer font-semibold text-accent hover:text-accent-hover"
                onClick={() => onChange({ ...params, foundational: true })}
                type="button"
              >
                Make this a foundational lesson
              </button>
            </span>
          </p>
        </>
      )}

      <div className="mt-1 flex justify-end">
        <Button onClick={onNext}>Build prompt →</Button>
      </div>
    </div>
  );
}
