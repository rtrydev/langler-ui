import { Suspense } from "react";
import { ReviewSession } from "./_components/ReviewSession";

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <p className="font-mono text-sm text-ink-2" role="status">
          Preparing today&apos;s review…
        </p>
      }
    >
      <ReviewSession />
    </Suspense>
  );
}
