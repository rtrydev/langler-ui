"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Stepper } from "@/components/ui/Stepper";
import { getProfileLevels } from "@/lib/api/assessments";
import {
  generateLessonPrompt,
  listLessonTopics,
  type LessonIssue,
  type LessonTopic,
} from "@/lib/api/lessons";
import type { LanguageCode } from "@/lib/lesson-catalog";
import { promptParamsSchema } from "@/lib/validation/lesson";
import { ImportStep } from "./ImportStep";
import { ParametersStep } from "./ParametersStep";
import { PromptStep } from "./PromptStep";

export type WizardParams = {
  language: "ja" | "my" | "pl";
  level: string;
  topic: string;
  topicSlug: string;
  length: "short" | "standard" | "long";
  exerciseTypes: string[];
  foundational: boolean;
  includeReference: boolean;
};

const DEFAULT_PARAMS: WizardParams = {
  language: "ja",
  level: "N5",
  topic: "",
  topicSlug: "",
  length: "standard",
  exerciseTypes: ["cloze", "translation", "reading"],
  foundational: false,
  includeReference: true,
};

export type PromptState =
  | { status: "loading" }
  | { status: "ready"; text: string }
  | { status: "error"; message: string; issues?: LessonIssue[] };

export function CreateLessonWizard() {
  const session = useSession();
  const [step, setStep] = useState(0);
  const [params, setParams] = useState<WizardParams>(DEFAULT_PARAMS);
  const [prompt, setPrompt] = useState<PromptState>({ status: "loading" });
  const [paramsError, setParamsError] = useState("");
  const [estimatedLevels, setEstimatedLevels] = useState<
    Partial<Record<LanguageCode, string>>
  >({});
  const [topics, setTopics] = useState<LessonTopic[]>([]);

  useEffect(() => {
    let active = true;
    getProfileLevels(session).then((result) => {
      if (!active || !result.ok) return;
      const levels: Partial<Record<LanguageCode, string>> = {};
      for (const entry of result.data) {
        levels[entry.language as LanguageCode] = entry.level;
      }
      setEstimatedLevels(levels);
      setParams((current) => {
        const estimate = levels[current.language];
        if (!estimate || current.level !== DEFAULT_PARAMS.level) {
          return current;
        }
        return { ...current, level: estimate };
      });
    });
    return () => {
      active = false;
    };
  }, [session]);

  useEffect(() => {
    let active = true;
    listLessonTopics(session, params.language, params.level).then((result) => {
      if (!active) return;
      const loaded = result.ok ? result.topics : [];
      setTopics(loaded);
      setParams((current) => {
        if (
          current.topicSlug === "" ||
          loaded.some((topic) => topic.slug === current.topicSlug)
        ) {
          return current;
        }
        return { ...current, topicSlug: "" };
      });
    });
    return () => {
      active = false;
    };
  }, [session, params.language, params.level]);

  async function buildPrompt(next: WizardParams) {
    setPrompt({ status: "loading" });
    const request = {
      language: next.language,
      level: next.level,
      topic: next.topic.trim(),
      ...(next.topicSlug !== "" ? { topicSlug: next.topicSlug } : {}),
      exerciseTypes: next.exerciseTypes,
      readingStage: next.foundational
        ? ("foundational" as const)
        : ("connected" as const),
      length: next.length,
      includeReference: next.includeReference,
    };
    const checked = promptParamsSchema.safeParse(request);
    if (!checked.success) {
      setPrompt({
        status: "error",
        message: checked.error.issues[0]?.message ?? "Check the parameters.",
      });
      return;
    }
    const result = await generateLessonPrompt(session, checked.data);
    if (result.ok) {
      setPrompt({ status: "ready", text: result.prompt });
    } else {
      setPrompt({
        status: "error",
        message: result.error.message,
        issues: result.issues,
      });
    }
  }

  function startPrompt() {
    if (params.exerciseTypes.length === 0 && !params.foundational) {
      setParamsError("Pick at least one exercise type.");
      return;
    }
    setParamsError("");
    setStep(1);
    void buildPrompt(params);
  }

  function toggleReference(includeReference: boolean) {
    const next = { ...params, includeReference };
    setParams(next);
    void buildPrompt(next);
  }

  return (
    <div className="max-w-3xl">
      <Stepper
        className="mb-8 max-w-xl"
        current={step}
        onStepSelect={(index) => {
          if (index < step) {
            setStep(index);
          }
        }}
        steps={["Parameters", "Prompt", "Import"]}
      />
      {step === 0 ? (
        <ParametersStep
          error={paramsError}
          estimatedLevels={estimatedLevels}
          onChange={setParams}
          onNext={startPrompt}
          params={params}
          topics={topics}
        />
      ) : null}
      {step === 1 ? (
        <PromptStep
          includeReference={params.includeReference}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
          onRetry={() => void buildPrompt(params)}
          onToggleReference={toggleReference}
          prompt={prompt}
        />
      ) : null}
      {step === 2 ? <ImportStep onBack={() => setStep(1)} /> : null}
    </div>
  );
}
