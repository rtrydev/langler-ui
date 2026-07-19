import type {
  ClozeBlank,
  ExerciseOutcome,
  ExerciseQuestion,
  LessonExercise,
  LessonResultDocument,
} from "@/lib/api/lessons";

export function normalizeAnswer(value: string): string {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

// Deterministic Fisher-Yates keyed on the exercise id: stable across
// server/client renders (no hydration mismatch) but decoupled from the
// answer-revealing source order the AI produced.
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  let state = hash >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(next() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  if (
    items.length > 1 &&
    shuffled.every((item, index) => item === items[index]) &&
    new Set(items).size > 1
  ) {
    shuffled.push(shuffled.shift() as T);
  }
  return shuffled;
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

export function questionAnswers(question: ExerciseQuestion): string[] {
  if (!question.answer?.trim()) return [];
  return [question.answer, ...(question.alternates ?? [])];
}

export function gradeReading(
  exercise: LessonExercise,
  responses: Record<number, string>,
): ExerciseOutcome {
  const questions = exercise.payload?.questions ?? [];
  const gradable = questions.filter((question) => question.answer?.trim());
  const correct = questions.filter((question, index) => {
    const answers = questionAnswers(question);
    return answers.length > 0 && matchesAnswer(responses[index] ?? "", answers);
  }).length;
  return autoOutcome(exercise, correct, gradable.length);
}

export function gradeMultipleChoice(
  exercise: LessonExercise,
  responses: Record<number, string>,
): ExerciseOutcome {
  const questions = exercise.payload?.questions ?? [];
  const correct = questions.filter(
    (question, index) => responses[index] === question.answer,
  ).length;
  return autoOutcome(exercise, correct, questions.length);
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
