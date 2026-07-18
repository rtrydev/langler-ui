"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { listLessons, type LessonSummary } from "@/lib/api/lessons";
import { LANGUAGES } from "@/lib/lesson-catalog";
import { LessonCard } from "./LessonCard";

type LibraryState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; lessons: LessonSummary[] };

export function LessonLibrary() {
  const session = useSession();
  const [state, setState] = useState<LibraryState>({ kind: "loading" });
  const [languageFilter, setLanguageFilter] = useState("");

  useEffect(() => {
    let active = true;
    listLessons(session).then((result) => {
      if (!active) return;
      if (result.ok) {
        const lessons = [...result.data.items].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );
        setState({ kind: "ready", lessons });
      } else {
        setState({ kind: "error", message: result.error.message });
      }
    });
    return () => {
      active = false;
    };
  }, [session]);

  const header = (
    <div className="mb-6 flex items-center justify-between gap-4">
      <Heading as="h1" size="lg">
        Lessons
      </Heading>
      <Link href="/create/">
        <Button>+ New lesson</Button>
      </Link>
    </div>
  );

  if (state.kind === "loading") {
    return (
      <div>
        {header}
        <p className="font-mono text-sm text-ink-2" role="status">
          Opening your library…
        </p>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div>
        {header}
        <Callout tone="error">{state.message}</Callout>
      </div>
    );
  }

  if (state.lessons.length === 0) {
    return (
      <div>
        {header}
        <EmptyState
          description="Langler doesn't write lessons — your AI does. Build a prompt, paste it into any AI chat, and paste the JSON back."
          icon={<span className="font-jp-serif text-2xl text-ink-3">白</span>}
          title="Your notebook is empty"
        >
          <Link href="/create/">
            <Button>Create your first lesson</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  const filtered = languageFilter
    ? state.lessons.filter((lesson) => lesson.language === languageFilter)
    : state.lessons;
  const presentLanguages = LANGUAGES.filter((language) =>
    state.lessons.some((lesson) => lesson.language === language.code),
  );

  return (
    <div>
      {header}
      {presentLanguages.length > 1 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          <Pill
            onClick={() => setLanguageFilter("")}
            selected={languageFilter === ""}
          >
            All languages
          </Pill>
          {presentLanguages.map((language) => (
            <Pill
              key={language.code}
              onClick={() => setLanguageFilter(language.code)}
              selected={languageFilter === language.code}
              tone={language.tone}
            >
              {language.englishName}
            </Pill>
          ))}
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((lesson) => (
          <LessonCard key={lesson.lessonId} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
