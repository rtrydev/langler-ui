import "client-only";

import type { AuthSession } from "@/lib/auth/cognito";
import {
  reviewGradeSchema,
  type ReviewGradeInput,
} from "@/lib/validation/progress";

export type ProgressApiError = {
  kind: "configuration" | "network" | "response" | "validation";
  message: string;
  status?: number;
};

export type ReviewItem = {
  itemId: string;
  kind: "vocab" | "grammar";
  headword: string;
  reading?: string;
  gloss: string;
  example?: string;
  exampleMeaning?: string;
  easeFactor: number;
  intervalDays: number;
  dueDate: string;
};

export type DueLanguage = {
  language: string;
  items: ReviewItem[];
};

export type ReviewDay = { date: string; count: number };

export type RecentLesson = {
  lessonId: string;
  title: string;
  score: number;
  maxScore: number;
  completedAt: string;
};

export type LanguageProgress = {
  language: string;
  lessonsCompleted: number;
  itemsTracked: number;
  dueToday: number;
  currentReviewStreak: number;
  reviewHistory: ReviewDay[];
  recentLessons: RecentLesson[];
};

export type DueResult =
  | { ok: true; data: DueLanguage[] }
  | { ok: false; error: ProgressApiError };

export type ProgressResult =
  | { ok: true; data: LanguageProgress[] }
  | { ok: false; error: ProgressApiError };

export type GradeResult =
  | { ok: true; data: ReviewItem }
  | { ok: false; error: ProgressApiError };

const missingConfig: ProgressApiError = {
  kind: "configuration",
  message: "Langler API is not configured.",
};

const unavailable: ProgressApiError = {
  kind: "network",
  message: "The Langler API is unavailable.",
};

async function responseError(response: Response): Promise<ProgressApiError> {
  let message = `The Langler API returned ${response.status}.`;
  const body = (await response
    .json()
    .catch(() => null)) as { error?: string } | null;
  if (body?.error) {
    message = body.error;
  }
  return { kind: "response", message, status: response.status };
}

export async function getProgressSummary(
  session: AuthSession,
): Promise<ProgressResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await fetch(`${apiUrl}/progress`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    const body = (await response.json()) as { languages: LanguageProgress[] };
    return { ok: true, data: body.languages };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function getDueReviews(
  session: AuthSession,
  language?: string,
): Promise<DueResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  const query = language
    ? `?language=${encodeURIComponent(language)}`
    : "";
  try {
    const response = await fetch(`${apiUrl}/reviews/due${query}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    const body = (await response.json()) as { languages: DueLanguage[] };
    return { ok: true, data: body.languages };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function gradeReview(
  session: AuthSession,
  input: ReviewGradeInput,
): Promise<GradeResult> {
  const parsed = reviewGradeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: { kind: "validation", message: "Choose a valid review grade." },
    };
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await fetch(`${apiUrl}/reviews/grade`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    return { ok: true, data: (await response.json()) as ReviewItem };
  } catch {
    return { ok: false, error: unavailable };
  }
}
