"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Pill } from "@/components/ui/Pill";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LanguagePicker } from "@/components/LanguagePicker";
import type { LessonTopic } from "@/lib/api/lessons";
import {
  EXERCISE_TYPES,
  LANGUAGES,
  LESSON_LENGTHS,
  type LanguageCode,
  type LanguageOption,
} from "@/lib/lesson-catalog";
import type { WizardParams } from "./CreateLessonWizard";

type ParametersStepProps = {
  params: WizardParams;
  error: string;
  estimatedLevels: Partial<Record<LanguageCode, string>>;
  topics: LessonTopic[];
  onChange: (params: WizardParams) => void;
  onNext: () => void;
};

export function ParametersStep({
  params,
  error,
  estimatedLevels,
  topics,
  onChange,
  onNext,
}: ParametersStepProps) {
  function selectLanguage(option: LanguageOption) {
    onChange({
      ...params,
      language: option.code,
      level: estimatedLevels[option.code] ?? option.levels[0],
    });
  }

  function selectTopic(topic: LessonTopic) {
    if (params.topicSlug === topic.slug) {
      onChange({ ...params, topic: "", topicSlug: "" });
      return;
    }
    onChange({ ...params, topic: topic.name, topicSlug: topic.slug });
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
      <LanguagePicker onSelect={selectLanguage} value={params.language} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label className="mb-2.5 block text-[13px] font-semibold">
            Level
            {estimatedLevels[params.language] === params.level ? (
              <span className="ml-2 font-normal text-ink-3">
                from your placement
              </span>
            ) : null}
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
          {!estimatedLevels[params.language] ? (
            <p className="mt-2 text-xs text-ink-3">
              Not sure?{" "}
              <Link
                className="font-semibold text-accent hover:text-accent-hover"
                href="/assess/"
              >
                Take the placement test →
              </Link>
            </p>
          ) : null}
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
          onChange={(event) =>
            onChange({ ...params, topic: event.target.value, topicSlug: "" })
          }
          placeholder="Weekend travel — a trip to Kyoto"
          value={params.topic}
        />
        {topics.length > 0 ? (
          <>
            <p className="mt-2.5 text-xs text-ink-3">
              Or pick a suggestion — the lesson then uses words from that topic
              you have not covered yet.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Pill
                  key={topic.slug}
                  onClick={() => selectTopic(topic)}
                  selected={params.topicSlug === topic.slug}
                  title={topic.description}
                >
                  {topic.name}
                  <span
                    className={
                      params.topicSlug === topic.slug
                        ? "text-[11px] font-normal opacity-80"
                        : "text-[11px] text-ink-3"
                    }
                  >
                    {topic.coveredCount}/{topic.wordCount}
                  </span>
                </Pill>
              ))}
            </div>
          </>
        ) : null}
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
                  Opens the lesson with a short, level-appropriate story that
                  introduces the new words and grammar in context before the
                  exercises practice them.
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
