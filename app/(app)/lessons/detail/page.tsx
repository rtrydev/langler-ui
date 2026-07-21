import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { LessonDetailView } from "./_components/LessonDetailView";

export default function LessonDetailPage() {
  return (
    <Suspense fallback={<LoadingState>Opening the lesson…</LoadingState>}>
      <LessonDetailView />
    </Suspense>
  );
}
