"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { OptionCard } from "@/components/ui/OptionCard";
import { StepProgress } from "@/components/ui/StepProgress";
import {
  getAssessment,
  startAssessment,
  submitAssessmentAnswers,
  type AssessmentView,
} from "@/lib/api/assessments";
import { cn } from "@/lib/cn";
import {
  LANGUAGES,
  languageOption,
  levelDescriptor,
  levelLabel,
  type LanguageCode,
  type LanguageOption,
} from "@/lib/lesson-catalog";

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

const LANGUAGE_TEXT: Record<LanguageOption["tone"], string> = {
  vermilion: "text-vermilion",
  gold: "text-gold",
  crimson: "text-crimson",
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
      <p className="font-mono text-sm text-ink-2" role="status">
        {state.kind === "starting"
          ? "Assembling your first questions…"
          : "Picking up where you left off…"}
      </p>
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
    <Card className="mx-auto flex min-h-[31rem] max-w-[620px] flex-col overflow-hidden" padding="none">
      <div className="flex h-[52px] items-center gap-4 border-b border-line px-5">
        <Link aria-label="Exit placement test" className="text-xl text-ink-2 hover:text-ink" href="/">
          ×
        </Link>
        <span className="rounded-[5px] bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent">
          {option?.nativeName ?? state.view.language}
        </span>
        <span className="text-xs text-ink-3">
          Round {stage.index + 1} · {levelLabel(state.view.language, stage.band)}
        </span>
        <span className="ml-auto text-xs text-ink-3">
          {state.answers.length + 1} / {stage.items.length}
        </span>
      </div>
      <StepProgress
        className="mx-5 mt-4"
        completed={state.answers.length}
        total={stage.items.length}
      />

      {state.submitting || !item ? (
        <p className="flex flex-1 items-center justify-center font-mono text-sm text-ink-2" role="status">
          Checking this round…
        </p>
      ) : (
        <div className="flex flex-1 flex-col px-6 py-8">
          <p className="text-center text-[11px] font-semibold tracking-wide text-ink-3 uppercase">
            {ITEM_KIND_LABELS[item.kind] ?? item.kind}
          </p>
          <p
            className={cn(
              "my-6 text-center leading-relaxed text-ink",
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
                className="px-4 py-3 text-[14px]"
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
        </div>
      )}
    </Card>
  );
}

type IntroScreenProps = {
  language: LanguageCode;
  message: string;
  onLanguageChange: (code: LanguageCode) => void;
  onStart: () => void;
};

function IntroScreen({ language, message, onLanguageChange, onStart }: IntroScreenProps) {
  return (
    <div className="mx-auto max-w-xl">
      <Heading as="h1" size="lg">
        Find your level
      </Heading>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
        A short placement test that adapts round by round. Most sessions take
        5–10 minutes; it ends early once it finds your edge.
      </p>

      <fieldset className="mt-6">
        <legend className="mb-2.5 text-[13px] font-semibold">Language</legend>
        <div className="grid grid-cols-3 gap-3">
          {LANGUAGES.map((option) => (
            <OptionCard
              className="px-2 py-4 text-center"
              key={option.code}
              onClick={() => onLanguageChange(option.code)}
              selected={language === option.code}
            >
              <span
                className={cn(
                  "block text-2xl leading-snug",
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

      <Card className="mt-6" elevation="card">
        <p className="text-[13.5px] font-semibold">What to expect</p>
        <ul className="mt-2 grid gap-1.5 text-[13px] leading-relaxed text-ink-2">
          <li>· Multiple-choice vocabulary, grammar, and reading questions.</li>
          <li>· Each round steps up a level; the test stops when a round gets hard.</li>
          <li>· No timer, no penalty for guessing — skip nothing, just answer.</li>
        </ul>
      </Card>

      <Callout className="mt-4" tone="info">
        The result is approximate guidance, not a certification. It pre-fills
        your lesson level, and you can always override it.
      </Callout>

      {message ? (
        <Callout className="mt-4" tone="error">
          {message}
        </Callout>
      ) : null}

      <div className="mt-6">
        <Button onClick={onStart} size="lg">
          Start the placement test
        </Button>
      </div>
    </div>
  );
}

type ResultScreenProps = {
  view: AssessmentView;
  onRetake: () => void;
};

function ResultScreen({ view, onRetake }: ResultScreenProps) {
  const result = view.result;
  const option = languageOption(view.language);
  if (!result || !option) {
    return (
      <div className="mx-auto max-w-xl">
        <Callout tone="error">This assessment has no result yet.</Callout>
      </div>
    );
  }
  const tested = new Map(result.bands.map((band) => [band.band, band]));
  const descriptor = levelDescriptor(result.estimatedLevel);

  return (
    <Card className="mx-auto max-w-[620px] text-center" padding="lg">
      <p className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">
        Placement complete · {option.englishName}
      </p>
      <p className="mt-6 text-sm text-ink-2">
        {result.floor ? "Start from the beginning at" : "Your estimated level is"}
      </p>
      <p className="mt-2 text-4xl font-bold text-ink sm:text-5xl">
        ≈ {levelLabel(view.language, result.estimatedLevel)}
      </p>
      {descriptor ? (
        <p className="mt-1.5 text-sm text-ink-2">{descriptor}</p>
      ) : null}

      <div className="mx-auto mt-6 flex max-w-sm gap-[5px]">
        {option.levels.map((band) => {
          const outcome = tested.get(band);
          const estimated = band === result.estimatedLevel;
          return (
            <span
              className={cn(
                "flex-1 rounded-[5px] border py-1.5 text-[11px] font-semibold",
                estimated
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-ink-3",
                outcome && !estimated && !outcome.passed && "line-through opacity-70",
              )}
              key={band}
            >
              {band}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-ink-3">
        {result.bands
          .map((band) => `${band.band} ${band.correct}/${band.total}`)
          .join(" · ")}{" "}
        · {result.confidence} confidence
      </p>

      <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-ink-2">
        {view.guidance}
      </p>

      <Callout className="mt-5 text-left" tone="success">
        This estimate now pre-fills your lesson level. You can change it any
        time you create a lesson.
      </Callout>

      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={onRetake} variant="secondary">
          Retake
        </Button>
        <Link href="/create/">
          <Button>Save &amp; continue</Button>
        </Link>
      </div>
    </Card>
  );
}
