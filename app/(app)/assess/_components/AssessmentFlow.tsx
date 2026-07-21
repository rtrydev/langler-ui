"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { SessionChrome } from "@/components/SessionChrome";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { OptionCard } from "@/components/ui/OptionCard";
import { Overline } from "@/components/ui/Overline";
import { StepProgress } from "@/components/ui/StepProgress";
import {
  getAssessment,
  startAssessment,
  submitAssessmentAnswers,
  type AssessmentView,
} from "@/lib/api/assessments";
import { cn } from "@/lib/cn";
import {
  languageOption,
  levelLabel,
  type LanguageCode,
} from "@/lib/lesson-catalog";
import { IntroScreen } from "./IntroScreen";
import { ResultScreen } from "./ResultScreen";

type FlowState =
  | { kind: "intro" }
  | { kind: "starting" }
  | { kind: "resuming" }
  | { kind: "error"; message: string }
  | { kind: "testing"; view: AssessmentView; answers: number[]; submitting: boolean }
  | { kind: "result"; view: AssessmentView };

const ITEM_KIND_LABELS: Record<string, string> = {
  vocab: "Vocabulary",
  grammar: "Grammar",
  reading: "Reading",
};

export function AssessmentFlow() {
  const session = useSession();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");
  const [language, setLanguage] = useState<LanguageCode>("ja");
  const [state, setState] = useState<FlowState>(
    resumeId ? { kind: "resuming" } : { kind: "intro" },
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!resumeId) return;
    let active = true;
    getAssessment(session, resumeId).then((result) => {
      if (!active) return;
      if (!result.ok) {
        setState({ kind: "error", message: result.error.message });
        return;
      }
      setLanguage(result.data.language as LanguageCode);
      setState(
        result.data.status === "completed"
          ? { kind: "result", view: result.data }
          : { kind: "testing", view: result.data, answers: [], submitting: false },
      );
    });
    return () => {
      active = false;
    };
  }, [resumeId, session]);

  async function start(code: LanguageCode) {
    setMessage("");
    setState({ kind: "starting" });
    const result = await startAssessment(session, { language: code });
    if (!result.ok) {
      setState({ kind: "intro" });
      setMessage(result.error.message);
      return;
    }
    setState({ kind: "testing", view: result.data, answers: [], submitting: false });
  }

  async function answer(choice: number) {
    if (state.kind !== "testing" || state.submitting || !state.view.stage) return;
    const stage = state.view.stage;
    const answers = [...state.answers, choice];
    if (answers.length < stage.items.length) {
      setState({ ...state, answers });
      return;
    }
    setState({ ...state, answers, submitting: true });
    const result = await submitAssessmentAnswers(session, state.view.assessmentId, {
      stageIndex: stage.index,
      answers,
    });
    if (!result.ok) {
      setMessage(result.error.message);
      setState({ ...state, answers: answers.slice(0, -1), submitting: false });
      return;
    }
    setMessage("");
    setState(
      result.data.status === "completed"
        ? { kind: "result", view: result.data }
        : { kind: "testing", view: result.data, answers: [], submitting: false },
    );
  }

  if (state.kind === "resuming" || state.kind === "starting") {
    return (
      <LoadingState>
        {state.kind === "starting"
          ? "Assembling your first questions…"
          : "Picking up where you left off…"}
      </LoadingState>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto max-w-xl">
        <Callout tone="error">{state.message}</Callout>
        <Link className="mt-4 inline-block" href="/assess/">
          <Button variant="secondary">Start a new placement test</Button>
        </Link>
      </div>
    );
  }

  if (state.kind === "intro") {
    return (
      <IntroScreen
        language={language}
        message={message}
        onLanguageChange={setLanguage}
        onStart={() => void start(language)}
      />
    );
  }

  if (state.kind === "result") {
    return <ResultScreen onRetake={() => void start(language)} view={state.view} />;
  }

  const stage = state.view.stage;
  if (!stage) {
    return (
      <div className="mx-auto max-w-xl">
        <Callout tone="error">This assessment has no open stage.</Callout>
      </div>
    );
  }
  const item = stage.items[state.answers.length];
  const option = languageOption(state.view.language);

  return (
    <SessionChrome
      exitHref="/"
      exitLabel="Exit placement test"
      badge={<Badge tone={option?.tone}>{option?.nativeName ?? state.view.language}</Badge>}
      progress={
        <StepProgress
          className="w-full"
          completed={state.answers.length}
          total={stage.items.length}
        />
      }
      counter={`${state.answers.length + 1} / ${stage.items.length}`}
      bodyClassName="px-6 py-8"
    >
      {state.submitting || !item ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingState>Checking this round…</LoadingState>
        </div>
      ) : (
        <>
          <Overline className="self-center">
            {ITEM_KIND_LABELS[item.kind] ?? item.kind}
          </Overline>
          <p className="mb-2 text-center font-mono text-[11px] text-ink-3">
            Round {stage.index + 1} · {levelLabel(state.view.language, stage.band)}
          </p>
          <p
            className={cn(
              "mb-6 text-center leading-relaxed text-ink",
              option?.code === "ja" && "font-jp-serif",
              option?.code === "my" && "font-myanmar",
              item.kind === "vocab" ? "text-4xl sm:text-5xl" : "text-xl sm:text-2xl",
            )}
            lang={state.view.language}
          >
            {item.prompt}
          </p>
          <p className="mb-3 text-center text-xs text-ink-3">
            {item.kind === "vocab"
              ? "Which meaning fits best?"
              : "Which translation fits best?"}
          </p>
          <div className="grid gap-2.5">
            {item.options.map((choice, index) => (
              <OptionCard
                className="text-[14px]"
                key={`${state.answers.length}-${index}`}
                onClick={() => void answer(index)}
              >
                {choice}
              </OptionCard>
            ))}
          </div>
          {message ? (
            <Callout className="mt-4" tone="error">
              {message}
            </Callout>
          ) : null}
          <p className="mt-auto pt-6 text-center text-[11px] text-ink-3">
            No timer — answer at your own pace. Guessing is fine; it only shapes
            the estimate.
          </p>
        </>
      )}
    </SessionChrome>
  );
}
