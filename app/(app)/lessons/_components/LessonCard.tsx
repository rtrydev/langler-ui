import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { LessonSummary } from "@/lib/api/lessons";
import {
  exerciseTypeLabel,
  languageOption,
} from "@/lib/lesson-catalog";

export function LessonCard({ lesson }: { lesson: LessonSummary }) {
  const language = languageOption(lesson.language);
  const imported = new Date(lesson.createdAt);
  const importedLabel = Number.isNaN(imported.getTime())
    ? ""
    : imported.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <Link className="group" href={`/lessons/detail/?id=${lesson.lessonId}`}>
      <Card
        className="h-full transition-colors group-hover:border-accent-border"
        elevation="card"
      >
        <div className="mb-2.5 flex items-start justify-between gap-3">
          <Badge tone={language?.tone ?? "neutral"}>
            {language?.nativeName ?? lesson.language} · {lesson.level}
          </Badge>
          <span className="font-mono text-[11px] text-ink-3">
            {lesson.sourceModel ? `✷ ${lesson.sourceModel}` : "Imported"}
            {importedLabel ? ` · ${importedLabel}` : ""}
          </span>
        </div>
        <p className="text-[16px] font-semibold leading-snug">{lesson.title}</p>
        {lesson.topic ? (
          <p className="mt-0.5 text-[12.5px] text-ink-2">{lesson.topic}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lesson.exerciseTypes
            .filter((type) => type !== "reading")
            .map((type) => (
              <Badge key={type} tone="muted">
                {exerciseTypeLabel(type)}
              </Badge>
            ))}
          {lesson.hasStory ? <Badge tone="accent">Story</Badge> : null}
        </div>
        <div className="mt-3.5 flex items-center gap-2 border-t border-line-2 pt-3 text-[11px] text-ink-3">
          <span>
            {lesson.exerciseCount}{" "}
            {lesson.exerciseCount === 1 ? "exercise" : "exercises"}
          </span>
          <span aria-hidden>·</span>
          <span>{lesson.totalPoints} points</span>
          {lesson.estimatedMinutes ? (
            <>
              <span aria-hidden>·</span>
              <span>~{lesson.estimatedMinutes} min</span>
            </>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
