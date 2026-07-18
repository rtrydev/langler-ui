import type { LessonExercise } from "@/lib/api/lessons";

export function ClozePrint({ exercise, answers }: { exercise: LessonExercise; answers: boolean }) {
  const blanks = new Map((exercise.payload?.blanks ?? []).map((blank) => [blank.index, blank]));
  return <p className="worksheet-japanese worksheet-leading">{(exercise.payload?.text ?? "").split(/(\{\{\d+\}\})/g).map((part, index) => {
    const marker = part.match(/^\{\{(\d+)\}\}$/);
    if (!marker) return <span key={`${part}-${index}`}>{part}</span>;
    const blank = blanks.get(Number(marker[1]));
    return <span className="worksheet-blank" key={`blank-${marker[1]}`}>{answers ? blank?.answer : ""}</span>;
  })}</p>;
}
