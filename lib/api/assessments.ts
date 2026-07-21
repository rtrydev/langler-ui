import "client-only";

import { authorizedFetch } from "@/lib/api/authorized-fetch";

import type { AuthSession } from "@/lib/auth/cognito";
import {
  assessmentAnswersSchema,
  assessmentStartSchema,
  type AssessmentAnswersInput,
  type AssessmentStartInput,
} from "@/lib/validation/assessment";

export type AssessmentApiError = {
  kind: "configuration" | "network" | "response" | "validation";
  message: string;
  status?: number;
};

export type AssessmentItem = {
  kind: "vocab" | "grammar" | "reading";
  prompt: string;
  options: string[];
};

export type AssessmentStage = {
  index: number;
  band: string;
  bandCount: number;
  items: AssessmentItem[];
};

export type AssessmentBandResult = {
  band: string;
  correct: number;
  total: number;
  passed: boolean;
};

export type AssessmentResult = {
  estimatedLevel: string;
  confidence: "high" | "medium" | "low";
  floor: boolean;
  bands: AssessmentBandResult[];
};

export type AssessmentView = {
  assessmentId: string;
  language: string;
  status: "in_progress" | "completed";
  guidance: string;
  startedAt: string;
  completedAt?: string;
  stage?: AssessmentStage;
  result?: AssessmentResult;
};

export type AssessmentSummary = {
  assessmentId: string;
  language: string;
  status: "in_progress" | "completed";
  estimatedLevel?: string;
  confidence?: string;
  floor: boolean;
  startedAt: string;
  completedAt?: string;
};

export type ProfileLevel = {
  language: string;
  level: string;
  assessmentId: string;
  updatedAt: string;
};

export type AssessmentViewResult =
  | { ok: true; data: AssessmentView }
  | { ok: false; error: AssessmentApiError };

export type AssessmentListResult =
  | { ok: true; data: AssessmentSummary[]; guidance: string }
  | { ok: false; error: AssessmentApiError };

export type ProfileLevelsResult =
  | { ok: true; data: ProfileLevel[] }
  | { ok: false; error: AssessmentApiError };

const missingConfig: AssessmentApiError = {
  kind: "configuration",
  message: "Langler API is not configured.",
};

const unavailable: AssessmentApiError = {
  kind: "network",
  message: "The Langler API is unavailable.",
};

async function responseError(response: Response): Promise<AssessmentApiError> {
  let message = `The Langler API returned ${response.status}.`;
  const body = (await response
    .json()
    .catch(() => null)) as { error?: string } | null;
  if (body?.error) {
    message = body.error;
  }
  return { kind: "response", message, status: response.status };
}

export async function startAssessment(
  session: AuthSession,
  input: AssessmentStartInput,
): Promise<AssessmentViewResult> {
  const parsed = assessmentStartSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: { kind: "validation", message: "Choose a supported language." },
    };
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await authorizedFetch(session, `${apiUrl}/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    return { ok: true, data: (await response.json()) as AssessmentView };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function submitAssessmentAnswers(
  session: AuthSession,
  assessmentId: string,
  input: AssessmentAnswersInput,
): Promise<AssessmentViewResult> {
  const parsed = assessmentAnswersSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: { kind: "validation", message: "Answer every question first." },
    };
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await authorizedFetch(session, 
      `${apiUrl}/assessments/${encodeURIComponent(assessmentId)}/answers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      },
    );
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    return { ok: true, data: (await response.json()) as AssessmentView };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function getAssessment(
  session: AuthSession,
  assessmentId: string,
): Promise<AssessmentViewResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await authorizedFetch(session, 
      `${apiUrl}/assessments/${encodeURIComponent(assessmentId)}`,
    );
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    return { ok: true, data: (await response.json()) as AssessmentView };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function listAssessments(
  session: AuthSession,
): Promise<AssessmentListResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await authorizedFetch(session, `${apiUrl}/assessments`);
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    const body = (await response.json()) as {
      items: AssessmentSummary[];
      guidance: string;
    };
    return { ok: true, data: body.items, guidance: body.guidance };
  } catch {
    return { ok: false, error: unavailable };
  }
}

export async function getProfileLevels(
  session: AuthSession,
): Promise<ProfileLevelsResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return { ok: false, error: missingConfig };
  }
  try {
    const response = await authorizedFetch(session, `${apiUrl}/profile/levels`);
    if (!response.ok) {
      return { ok: false, error: await responseError(response) };
    }
    const body = (await response.json()) as { levels: ProfileLevel[] };
    return { ok: true, data: body.levels };
  } catch {
    return { ok: false, error: unavailable };
  }
}
