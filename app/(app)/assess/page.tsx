import { Suspense } from "react";
import { AssessmentFlow } from "./_components/AssessmentFlow";

export default function AssessPage() {
  return (
    <Suspense
      fallback={
        <p className="font-mono text-sm text-ink-2" role="status">
          Preparing the placement test…
        </p>
      }
    >
      <AssessmentFlow />
    </Suspense>
  );
}
