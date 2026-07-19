import "client-only";

import type { AuthSession } from "@/lib/auth/cognito";
import { studyDate } from "@/lib/study-date";

export type LessonIssue = {
  path: string;
  message: string;
};

export type LessonApiError = {
  kind: "configuration" | "network" | "response";
  message: string;
  status?: number;
};

export type PromptRequest = {
  language: string;
  level: string;
  topic: string;
  topicSlug?: string;
  exerciseTypes: string[];
  readingStage: "connected" | "foundational";
  length: string;
  includeReference: boolean;
};

export type LessonTopic = {
  slug: string;
  name: string;
  description: string;
  wordCount: number;
  coveredCount: number;
};

export type TopicsResult =
  | { ok: true; topics: LessonTopic[] }
  | { ok: false; error: LessonApiError };

export type PromptResult =
  | { ok: true; prompt: string }
  | { ok: false; error: LessonApiError; issues?: LessonIssue[] };

export type ImportedLesson = {
  lessonId: string;
  title: string;
  language: string;
  level: string;
  readingStage: string;
  exerciseCount: number;
  totalPoints: number;
  vocabRefCount: number;
  createdAt: string;
  created: boolean;
};

export type ImportResult =
  | { ok: true; data: ImportedLesson }
  | { ok: false; error: LessonApiError; issues?: LessonIssue[] };

export type LessonSummary = {
  lessonId: string;
  language: string;
  level: string;
  title: string;
  description?: string;
  topic?: string;
  tags?: string[];
  readingStage: string;
  sourceModel?: string;
  estimatedMinutes?: number;
  exerciseTypes: string[];
  exerciseCount: number;
  totalPoints: number;
  hasStory: boolean;
  createdAt: string;
};

export type ClozeBlank = {
  index: number;
  answer: string;
  alternates?: string[];
  hint?: string;
};

export type ExerciseQuestion = {
  question: string;
  kind?: string;
  options?: string[];
  answer?: string;
  alternates?: string[];
};

export type ExercisePayload = {
  text?: string;
  blanks?: ClozeBlank[];
  wordBank?: string[];
  source?: string;
  reference?: string;
  items?: Array<string | { glyph: string; reading?: string; meaning?: string }>;
  translation?: string;
  pairs?: Array<{ left: string; right: string }>;
  genre?: string;
  title?: string;
  passage?: string;
  annotations?: Array<{ surface: string; reading?: string; gloss?: string }>;
  questions?: ExerciseQuestion[];
  guidance?: string;
  modelAnswer?: string;
};

export type LessonExercise = {
  exerciseId: string;
  type: string;
  prompt?: string;
  points?: number;
  referencedVocab?: string[];
  referencedGrammar?: string[];
  payload?: ExercisePayload;
};

export type LessonDetail = {
  schemaVersion: string;
  lessonId: string;
  language: string;
  level: string;
  title: string;
  description?: string;
  topic?: string;
  tags?: string[];
  readingStage: string;
  sourceModel?: string;
  estimatedMinutes?: number;
  exercises: LessonExercise[];
  createdAt: string;
};

export type ListResult =
  | { ok: true; data: { items: LessonSummary[]; nextCursor?: string } }
  | { ok: false; error: LessonApiError };

export type DetailResult =
  | { ok: true; data: LessonDetail }
  | { ok: false; error: LessonApiError };

export type DeleteResult = { ok: true } | { ok: false; error: LessonApiError };

export type ExerciseOutcome = {
  exerciseId: string;
  type: string;
  grading: "auto" | "self";
  score: number;
  maxScore: number;
  correct: number;
  total: number;
};

export type LessonResultDocument = {
  attemptId: string;
  startedAt: string;
  completedAt: string;
  score: number;
  maxScore: number;
  autoScore: number;
  autoMax: number;
  selfScore: number;
  selfMax: number;
  exercises: ExerciseOutcome[];
};

export type SavedLessonResult = { attemptId: string; lessonId: string };

export type SaveResult =
  | { ok: true; data: SavedLessonResult }
  | { ok: false; error: LessonApiError };

const missingConfig: LessonApiError = {
  kind: "configuration",
  message: "Langler API is not configured.",
};

const unavailable: LessonApiError = {
  kind: "network",
  message: "The Langler API is unavailable.",
};

async function responseError(response: Response): Promise<{
  error: LessonApiError;
  issues?: LessonIssue[];
}> {
  let message = `The Langler API returned ${response.status}.`;
  let issues: LessonIssue[] | undefined;
  try {
    const body = (await response.json()) as {
      error?: string;
      issues?: LessonIssue[];
    };
    if (body.error) {
      message = body.error;
    }
    if (Array.isArray(body.issues) && body.issues.length > 0) {
      issues = body.issues;
    }
  } catch {
    // keep the status-based message
  }
  return {
    error: { kind: "response", message, status: response.status },
    issues,
  };
}

export async function generateLessonPrompt(
  session: AuthSession,
  request: PromptRequest,
): Promise<PromptResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await fetch(`${apiUrl}/lessons/prompt`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      return { ok: false, ...(await responseError(response)) };
    }
    const data = (await response.json()) as { prompt: string };
    return { ok: true, prompt: data.prompt };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function listLessonTopics(
  session: AuthSession,
  language: string,
  level: string,
): Promise<TopicsResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const query = new URLSearchParams({ lang: language, level });
    const response = await fetch(`${apiUrl}/lessons/topics?${query}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!response.ok) {
      return { ok: false, error: (await responseError(response)).error };
    }
    const data = (await response.json()) as { topics: LessonTopic[] };
    return { ok: true, topics: data.topics };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function importLesson(
  session: AuthSession,
  document: Record<string, unknown>,
): Promise<ImportResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
	const idempotencyKey =
		typeof document.lessonId === "string"
			? `lesson-${document.lessonId}`
			: `lesson-${crypto.randomUUID()}`;
    const response = await fetch(`${apiUrl}/lessons/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
		"Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(document),
    });
    if (!response.ok) {
      return { ok: false, ...(await responseError(response)) };
    }
    return { ok: true, data: (await response.json()) as ImportedLesson };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function listLessons(session: AuthSession): Promise<ListResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await fetch(`${apiUrl}/lessons`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (!response.ok) {
      return { ok: false, error: (await responseError(response)).error };
    }
    const data = (await response.json()) as {
      items: LessonSummary[];
      nextCursor?: string;
    };
    return { ok: true, data };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function getLesson(
  session: AuthSession,
  lessonId: string,
): Promise<DetailResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await fetch(
      `${apiUrl}/lessons/${encodeURIComponent(lessonId)}`,
      { headers: { Authorization: `Bearer ${session.accessToken}` } },
    );
    if (!response.ok) {
      return { ok: false, error: (await responseError(response)).error };
    }
    return { ok: true, data: (await response.json()) as LessonDetail };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function deleteLesson(
  session: AuthSession,
  lessonId: string,
): Promise<DeleteResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await fetch(
      `${apiUrl}/lessons/${encodeURIComponent(lessonId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      },
    );
    if (!response.ok) {
      return { ok: false, error: (await responseError(response)).error };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function saveLessonResult(
  session: AuthSession,
  lessonId: string,
  result: LessonResultDocument,
): Promise<SaveResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await fetch(
      `${apiUrl}/lessons/${encodeURIComponent(lessonId)}/results`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...result,
          completedOn: studyDate(new Date(result.completedAt)),
        }),
      },
    );
    if (!response.ok) {
      return { ok: false, error: (await responseError(response)).error };
    }
    return { ok: true, data: (await response.json()) as SavedLessonResult };
  } catch {
    return { ok: false, error: unavailable };
  }
}
