import type { LessonExercise } from "@/lib/api/lessons";
import { seededShuffle } from "@/lib/lesson-grading";

export function ClozePrint({ exercise, answers }: { exercise: LessonExercise; answers: boolean }) {
  const blanks = new Map((exercise.payload?.blanks ?? []).map((blank) => [blank.index, blank]));
  const wordBank = seededShuffle(exercise.payload?.wordBank ?? [], exercise.exerciseId);
  return <>
    {!answers && wordBank.length ? <p className="worksheet-tokens">{wordBank.map((word) => <span key={word}>{word}</span>)}</p> : null}
    <p className="worksheet-japanese worksheet-leading">{(exercise.payload?.text ?? "").split(/(\{\{\d+\}\})/g).map((part, index) => {
      const marker = part.match(/^\{\{(\d+)\}\}$/);
      if (!marker) return <span key={`${part}-${index}`}>{part}</span>;
      const blank = blanks.get(Number(marker[1]));
      return <span className="worksheet-blank" key={`blank-${marker[1]}`}>{answers ? blank?.answer : ""}</span>;
    })}</p>
  </>;
}
