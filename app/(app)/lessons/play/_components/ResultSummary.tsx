import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Overline } from "@/components/ui/Overline";
import { Progress } from "@/components/ui/Progress";
import { StatusCircle } from "@/components/ui/StatusCircle";
import type { LessonDetail, LessonResultDocument } from "@/lib/api/lessons";
import { exerciseTypeLabel, languageOption } from "@/lib/lesson-catalog";

export function ResultSummary({
  lesson,
  result,
  saveError,
  saving,
  onRetrySave,
  onRetry,
}: {
  lesson: LessonDetail;
  result: LessonResultDocument;
  saveError: string;
  saving: boolean;
  onRetrySave: () => void;
  onRetry: () => void;
}) {
  const language = languageOption(lesson.language);
  const percentage = result.maxScore === 0 ? 0 : Math.round((result.score / result.maxScore) * 100);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <Badge tone={language?.tone ?? "neutral"}>{language?.nativeName ?? lesson.language} · {lesson.level}</Badge>
        <p className="mt-4 text-sm text-ink-3">Lesson complete</p>
        <Heading as="h1" className="mt-1" size="lg">{lesson.title}</Heading>
        <p className="mt-6 font-display text-7xl font-bold tracking-[-0.03em] text-success">{percentage}<span className="text-3xl">%</span></p>
        <p className="mt-1 text-xs text-ink-3">{result.score} / {result.maxScore} points</p>
        <Progress className="mx-auto mt-5 h-2.5 max-w-xs" value={percentage} />
      </div>
      <Card className="mt-8" padding="none">
        {result.exercises.map((outcome, index) => (
          <div className="flex items-center gap-3 border-b border-line-2 px-4 py-3 last:border-b-0" key={outcome.exerciseId}>
            <StatusCircle tone={outcome.score === outcome.maxScore ? "success" : outcome.score === 0 ? "error" : "neutral"}>{outcome.score === outcome.maxScore ? "✓" : outcome.score === 0 ? "×" : "◐"}</StatusCircle>
            <span className="flex-1 text-sm font-medium">{index + 1} · {exerciseTypeLabel(outcome.type)} {outcome.grading === "self" ? <span className="text-xs font-normal text-ink-3">self-assessed</span> : null}</span>
            <span className="text-sm font-semibold">{outcome.score} / {outcome.maxScore}</span>
          </div>
        ))}
      </Card>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Card className="bg-surface-2 text-center" elevation="flat">
          <Overline>Auto-graded</Overline>
          <p className="mt-1 font-display text-xl font-semibold">{result.autoScore} / {result.autoMax}</p>
        </Card>
        <Card className="bg-surface-2 text-center" elevation="flat">
          <Overline>Self-assessed</Overline>
          <p className="mt-1 font-display text-xl font-semibold">{result.selfScore} / {result.selfMax}</p>
        </Card>
      </div>
      {saving ? <Callout className="mt-5" tone="info">Saving your result…</Callout> : saveError ? <Callout className="mt-5" tone="error">{saveError} <Button className="ml-2" onClick={onRetrySave} size="sm" variant="secondary">Retry save</Button></Callout> : <Callout className="mt-5" tone="success">Your result was saved.</Callout>}
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <Link href="/lessons/"><Button size="lg" variant="secondary">Back to library</Button></Link>
        <Link href={`/lessons/print/?id=${lesson.lessonId}`}><Button size="lg" variant="secondary">Print worksheet</Button></Link>
        <Button disabled={saving} onClick={onRetry} size="lg">Retry lesson</Button>
      </div>
    </div>
  );
}
