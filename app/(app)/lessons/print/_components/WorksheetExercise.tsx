import type { LessonExercise, ScriptPracticeItem } from "@/lib/api/lessons";
import { kanjiVGReference, strokeAssetUrl } from "@/lib/api/reference";
import { glossaryEntries } from "@/lib/glossary";
import { EXERCISE_TYPES } from "@/lib/lesson-catalog";
import { seededShuffle } from "@/lib/lesson-grading";
import { ClozePrint } from "./ClozePrint";

const KNOWN_EXERCISE_TYPES: Set<string> = new Set(EXERCISE_TYPES.map((type) => type.code));

const FALLBACK_INSTRUCTIONS: Record<string, string> = {
  cloze: "Fill in each blank.",
  translation: "Translate the sentence.",
  ordering: "Arrange the parts into the correct order.",
  matching: "Match each item with its meaning.",
  multiple_choice: "Choose the correct answer.",
  reading: "Read the passage and answer the questions.",
  writing_prompt: "Respond to the writing prompt.",
  script_practice: "Practice the items below.",
};

export function WorksheetExercise({ exercise, index, answers, language }: { exercise: LessonExercise; index: number; answers: boolean; language: string }) {
  const payload = exercise.payload;
  const practiceItems = (payload?.items ?? []).filter(
    (item): item is ScriptPracticeItem => typeof item !== "string",
  );
  const orthography = practiceItems.some((item) => item.kind);
  const instruction = exercise.prompt || FALLBACK_INSTRUCTIONS[exercise.type];
  return (
    <section className={`worksheet-exercise ${exercise.type === "reading" ? "worksheet-story" : "worksheet-keep"}`}>
      <h2>{instruction ? `${index + 1}. ${instruction}` : `${index + 1}.`}</h2>
      {exercise.type === "cloze" ? <ClozePrint answers={answers} exercise={exercise} /> : null}
      {exercise.type === "translation" ? <><p className="worksheet-japanese">{payload?.source}</p>{answers ? <p>{payload?.reference || "Self-assessed response"}</p> : <div className="worksheet-lines" />}</> : null}
      {exercise.type === "ordering" ? <><div className="worksheet-tokens">{seededShuffle((payload?.items ?? []).filter((item): item is string => typeof item === "string"), exercise.exerciseId).map((item, itemIndex) => <span key={`${item}-${itemIndex}`}>{item}</span>)}</div>{answers ? <p className="worksheet-answer">{(payload?.items ?? []).filter((item): item is string => typeof item === "string").join(" ")}</p> : <div className="worksheet-line" />}</> : null}
      {exercise.type === "matching" ? <div className="worksheet-matching">{payload?.pairs?.map((pair, pairIndex) => <p key={pair.left}><span>{pair.left}</span><span>{answers ? pair.right : `${pairIndex + 1}. ${seededShuffle((payload.pairs ?? []).map((entry) => entry.right), exercise.exerciseId)[pairIndex]}`}</span></p>)}</div> : null}
      {exercise.type === "multiple_choice" ? <ol className="worksheet-questions">{payload?.questions?.map((question, questionIndex) => <li key={`${question.question}-${questionIndex}`}><p>{question.question}</p>{answers ? <p className="worksheet-answer">{question.answer}</p> : <p className="worksheet-options">{seededShuffle(question.options ?? [], `${exercise.exerciseId}-${questionIndex}`).map((option, optionIndex) => `${String.fromCharCode(97 + optionIndex)}) ${option}`).join("    ")}</p>}</li>)}</ol> : null}
      {exercise.type === "reading" ? <><div className="worksheet-passage"><h3>{payload?.title}</h3>{(payload?.passage ?? "").split(/\n+/).filter(Boolean).map((paragraph, paragraphIndex) => <p key={`${paragraph.slice(0, 12)}-${paragraphIndex}`}>{paragraph}</p>)}</div><WorksheetGlossary annotations={payload?.annotations ?? []} /><ol className="worksheet-questions">{payload?.questions?.map((question, questionIndex) => <li key={`${question.question}-${questionIndex}`}><p>{question.question}</p>{answers ? <p className="worksheet-answer">{question.answer || "Self-assessed"}</p> : question.options?.length ? <p className="worksheet-options">{seededShuffle(question.options, `${exercise.exerciseId}-${questionIndex}`).map((option, optionIndex) => `${String.fromCharCode(97 + optionIndex)}) ${option}`).join("    ")}</p> : <div className="worksheet-line" />}</li>)}</ol></> : null}
      {exercise.type === "writing_prompt" ? <>{payload?.guidance ? <p>{payload.guidance}</p> : null}{answers ? <p className="worksheet-answer">{payload?.modelAnswer || "Responses will vary."}</p> : <div className="worksheet-lines worksheet-lines-long" />}</> : null}
      {exercise.type === "script_practice" && orthography ? <ol className="worksheet-orthography">{practiceItems.map((item, itemIndex) => <li key={`${item.answer}-${itemIndex}`}><p>{item.glyph || "Write the correct Polish spelling."}</p>{item.meaning ? <p className="worksheet-orthography-hint">{item.meaning}</p> : null}{answers ? <p className="worksheet-answer">{item.answer}</p> : item.kind === "choice" ? <p className="worksheet-options">{seededShuffle(item.options ?? [], `${exercise.exerciseId}-${itemIndex}`).map((option, optionIndex) => `${String.fromCharCode(97 + optionIndex)}) ${option}`).join("    ")}</p> : <div className="worksheet-line" />}</li>)}</ol> : null}
      {exercise.type === "script_practice" && !orthography ? <div className="worksheet-grids">{practiceItems.filter((item): item is ScriptPracticeItem & { glyph: string } => Boolean(item.glyph)).map((item, itemIndex) => {
        const reference = language === "ja" ? kanjiVGReference(item.glyph) : undefined;
        const asset = reference ? strokeAssetUrl(reference) : undefined;
        return <div className="worksheet-glyph-group" key={`${item.glyph}-${itemIndex}`}>{asset ? <object aria-label={`Stroke order for ${item.glyph}`} className="worksheet-stroke-hint" data={asset} type="image/svg+xml" /> : <div className="worksheet-grid worksheet-model">{item.glyph}</div>}<div className="worksheet-grid" /><div className="worksheet-grid" /><p>{item.reading}{item.meaning ? ` · ${item.meaning}` : ""} · {asset ? "stroke-order hint" : "trace the reference glyph"}</p></div>;
      })}</div> : null}
      {!KNOWN_EXERCISE_TYPES.has(exercise.type) ? <p className="worksheet-instruction">Unsupported exercise type: {exercise.type}</p> : null}
    </section>
  );
}

function WorksheetGlossary({ annotations }: { annotations: Array<{ surface: string; reading?: string; gloss?: string }> }) {
  const entries = glossaryEntries(annotations);
  if (!entries.length) return null;
  return (
    <section className="worksheet-glossary">
      <h3>Vocabulary</h3>
      <dl>
        {entries.map((item) => (
          <div key={item.surface}>
            <dt>{item.surface}</dt>
            {item.reading ? <span className="worksheet-glossary-reading">{item.reading}</span> : null}
            <dd>{item.gloss}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
