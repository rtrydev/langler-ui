import type { LessonExercise } from "@/lib/api/lessons";
import { kanjiVGReference, strokeAssetUrl } from "@/lib/api/reference";
import { exerciseTypeLabel } from "@/lib/lesson-catalog";
import { seededShuffle } from "@/lib/lesson-grading";
import { ClozePrint } from "./ClozePrint";

export function WorksheetExercise({ exercise, index, answers }: { exercise: LessonExercise; index: number; answers: boolean }) {
  const payload = exercise.payload;
  return (
    <section className={`worksheet-exercise ${exercise.type === "reading" ? "worksheet-story" : "worksheet-keep"}`}>
      <h2>{index + 1} · {exerciseTypeLabel(exercise.type)}</h2>
      {exercise.prompt ? <p className="worksheet-instruction">{exercise.prompt}</p> : null}
      {exercise.type === "cloze" ? <ClozePrint answers={answers} exercise={exercise} /> : null}
      {exercise.type === "translation" ? <><p className="worksheet-japanese">{payload?.source}</p>{answers ? <p>{payload?.reference || "Self-assessed response"}</p> : <div className="worksheet-lines" />}</> : null}
      {exercise.type === "ordering" ? <><div className="worksheet-tokens">{seededShuffle((payload?.items ?? []).filter((item): item is string => typeof item === "string"), exercise.exerciseId).map((item, itemIndex) => <span key={`${item}-${itemIndex}`}>{item}</span>)}</div>{answers ? <p className="worksheet-answer">{(payload?.items ?? []).filter((item): item is string => typeof item === "string").join(" ")}</p> : <div className="worksheet-line" />}</> : null}
      {exercise.type === "matching" ? <div className="worksheet-matching">{payload?.pairs?.map((pair, pairIndex) => <p key={pair.left}><span>{pair.left}</span><span>{answers ? pair.right : `${pairIndex + 1}. ${seededShuffle((payload.pairs ?? []).map((entry) => entry.right), exercise.exerciseId)[pairIndex]}`}</span></p>)}</div> : null}
      {exercise.type === "multiple_choice" ? <ol className="worksheet-questions">{payload?.questions?.map((question, questionIndex) => <li key={`${question.question}-${questionIndex}`}><p>{question.question}</p>{answers ? <p className="worksheet-answer">{question.answer}</p> : <p className="worksheet-options">{seededShuffle(question.options ?? [], `${exercise.exerciseId}-${questionIndex}`).map((option, optionIndex) => `${String.fromCharCode(97 + optionIndex)}) ${option}`).join("    ")}</p>}</li>)}</ol> : null}
      {exercise.type === "reading" ? <><div className="worksheet-passage"><h3>{payload?.title}</h3>{(payload?.passage ?? "").split(/\n+/).filter(Boolean).map((paragraph, paragraphIndex) => <p key={`${paragraph.slice(0, 12)}-${paragraphIndex}`}>{paragraph}</p>)}</div><ol className="worksheet-questions">{payload?.questions?.map((question, questionIndex) => <li key={`${question.question}-${questionIndex}`}><p>{question.question}</p>{answers ? <p className="worksheet-answer">{question.answer || "Self-assessed"}</p> : question.options?.length ? <p className="worksheet-options">{seededShuffle(question.options, `${exercise.exerciseId}-${questionIndex}`).map((option, optionIndex) => `${String.fromCharCode(97 + optionIndex)}) ${option}`).join("    ")}</p> : <div className="worksheet-line" />}</li>)}</ol></> : null}
      {exercise.type === "writing_prompt" ? <>{payload?.guidance ? <p>{payload.guidance}</p> : null}{answers ? <p className="worksheet-answer">{payload?.modelAnswer || "Responses will vary."}</p> : <div className="worksheet-lines worksheet-lines-long" />}</> : null}
      {exercise.type === "script_practice" ? <div className="worksheet-grids">{(payload?.items ?? []).filter((item): item is { glyph: string; reading?: string; meaning?: string } => typeof item !== "string").map((item, itemIndex) => {
        const reference = kanjiVGReference(item.glyph);
        const asset = reference ? strokeAssetUrl(reference) : undefined;
        return <div className="worksheet-glyph-group" key={`${item.glyph}-${itemIndex}`}>{asset ? <object aria-label={`Stroke order for ${item.glyph}`} className="worksheet-stroke-hint" data={asset} type="image/svg+xml" /> : <div className="worksheet-grid worksheet-model">{item.glyph}</div>}<div className="worksheet-grid" /><div className="worksheet-grid" /><p>{item.reading}{item.meaning ? ` · ${item.meaning}` : ""} · stroke-order hint</p></div>;
      })}</div> : null}
    </section>
  );
}
