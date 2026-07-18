import type { ExerciseOutcome, LessonExercise } from "@/lib/api/lessons";

export type ExercisePlayerProps = {
  exercise: LessonExercise;
  onComplete: (outcome: ExerciseOutcome) => void;
};
