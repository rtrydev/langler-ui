import { Suspense } from "react";
import { LessonPlayer } from "./_components/LessonPlayer";

export default function LessonPlayerPage() {
  return <Suspense fallback={<p className="font-mono text-sm text-ink-2">Preparing your lesson…</p>}><LessonPlayer /></Suspense>;
}
