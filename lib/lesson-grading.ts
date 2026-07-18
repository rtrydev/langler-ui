import type {
  ClozeBlank,
  ExerciseOutcome,
  LessonExercise,
  LessonResultDocument,
} from "@/lib/api/lessons";

export function normalizeAnswer(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function matchesAnswer(value: string, answers: string[]): boolean {
  const normalized = normalizeAnswer(value);
  return answers.some((answer) => normalizeAnswer(answer) === normalized);
}

export function scoreFromCorrect(points: number, correct: number, total: number): number {
  return total === 0 ? 0 : Math.round(points * (correct / total));
}

export function gradeCloze(
  exercise: LessonExercise,
  responses: Record<number, string>,
): ExerciseOutcome {
  const blanks = exercise.payload?.blanks ?? [];
  const correct = blanks.filter((blank: ClozeBlank) =>
    matchesAnswer(responses[blank.index] ?? "", [
      blank.answer,
      ...(blank.alternates ?? []),
    ]),
  ).length;
  return autoOutcome(exercise, correct, blanks.length);
}

export function gradeOrdering(
  exercise: LessonExercise,
  arranged: string[],
): ExerciseOutcome {
  const expected = stringItems(exercise);
  const correct = expected.filter((item, index) => arranged[index] === item).length;
  return autoOutcome(exercise, correct, expected.length);
}

export function gradeMatching(
  exercise: LessonExercise,
  matches: Record<string, string>,
): ExerciseOutcome {
  const pairs = exercise.payload?.pairs ?? [];
  const correct = pairs.filter((pair) => matches[pair.left] === pair.right).length;
  return autoOutcome(exercise, correct, pairs.length);
}

export function gradeReading(
  exercise: LessonExercise,
  responses: Record<number, string>,
): ExerciseOutcome {
  const questions = exercise.payload?.questions ?? [];
  const gradable = questions.filter((question) => question.answer?.trim());
  const correct = questions.filter((question, index) =>
    question.answer?.trim() && matchesAnswer(responses[index] ?? "", [question.answer]),
  ).length;
  return autoOutcome(exercise, correct, gradable.length);
}

export function selfOutcome(
  exercise: LessonExercise,
  rating: number,
): ExerciseOutcome {
  const maxScore = exercise.points ?? 0;
  return {
    exerciseId: exercise.exerciseId,
    type: exercise.type,
    grading: "self",
    score: scoreFromCorrect(maxScore, rating, 4),
    maxScore,
    correct: rating,
    total: 4,
  };
}

export function stringItems(exercise: LessonExercise): string[] {
  return (exercise.payload?.items ?? []).filter(
    (item): item is string => typeof item === "string",
  );
}

export function buildLessonResult(
  attemptId: string,
  startedAt: string,
  completedAt: string,
  exercises: ExerciseOutcome[],
): LessonResultDocument {
  const auto = exercises.filter((exercise) => exercise.grading === "auto");
  const self = exercises.filter((exercise) => exercise.grading === "self");
  return {
    attemptId,
    startedAt,
    completedAt,
    score: exercises.reduce((sum, exercise) => sum + exercise.score, 0),
    maxScore: exercises.reduce((sum, exercise) => sum + exercise.maxScore, 0),
    autoScore: auto.reduce((sum, exercise) => sum + exercise.score, 0),
    autoMax: auto.reduce((sum, exercise) => sum + exercise.maxScore, 0),
    selfScore: self.reduce((sum, exercise) => sum + exercise.score, 0),
    selfMax: self.reduce((sum, exercise) => sum + exercise.maxScore, 0),
    exercises,
  };
}

function autoOutcome(
  exercise: LessonExercise,
  correct: number,
  total: number,
): ExerciseOutcome {
  const maxScore = exercise.points ?? 0;
  return {
    exerciseId: exercise.exerciseId,
    type: exercise.type,
    grading: "auto",
    score: scoreFromCorrect(maxScore, correct, total),
    maxScore,
    correct,
    total,
  };
}
