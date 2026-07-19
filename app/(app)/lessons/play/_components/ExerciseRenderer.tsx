import { Fragment } from "react";
import { ClozeExercise } from "./ClozeExercise";
import { MatchingExercise } from "./MatchingExercise";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import { OrderingExercise } from "./OrderingExercise";
import { PolishOrthographyExercise } from "./PolishOrthographyExercise";
import { ReadingExercise } from "./ReadingExercise";
import { ScriptPracticeExercise } from "./ScriptPracticeExercise";
import { TranslationExercise } from "./TranslationExercise";
import type { ExercisePlayerProps } from "./types";
import { WritingExercise } from "./WritingExercise";

export function ExerciseRenderer({
  exercise,
  language,
  level,
  onComplete,
}: ExercisePlayerProps & { language: string; level: string }) {
  const props = { exercise, onComplete };
  const renderers: Record<string, React.ReactNode> = {
    cloze: <ClozeExercise {...props} />,
    translation: <TranslationExercise {...props} />,
    ordering: <OrderingExercise {...props} />,
    matching: <MatchingExercise {...props} />,
    multiple_choice: <MultipleChoiceExercise {...props} />,
    reading: <ReadingExercise {...props} language={language} level={level} />,
    writing_prompt: <WritingExercise {...props} />,
    script_practice:
      language === "pl" ? (
        <PolishOrthographyExercise {...props} />
      ) : (
        <ScriptPracticeExercise {...props} language={language} level={level} />
      ),
  };
  return <Fragment key={exercise.exerciseId}>{renderers[exercise.type] ?? <p>Unsupported exercise type: {exercise.type}</p>}</Fragment>;
}
