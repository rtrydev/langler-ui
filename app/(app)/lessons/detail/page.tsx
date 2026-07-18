import { Suspense } from "react";
import { LessonDetailView } from "./_components/LessonDetailView";

export default function LessonDetailPage() {
  return (
    <Suspense
      fallback={
        <p className="font-mono text-sm text-ink-2" role="status">
          Opening the lesson…
        </p>
      }
    >
      <LessonDetailView />
    </Suspense>
  );
}
