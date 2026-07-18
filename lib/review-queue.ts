import type { DueLanguage, ReviewItem } from "@/lib/api/progress";

export type QueuedReviewItem = ReviewItem & { language: string };

export function reviewQueue(groups: DueLanguage[]): QueuedReviewItem[] {
  return groups.flatMap((group) =>
    group.items.map((item) => ({ ...item, language: group.language })),
  );
}
