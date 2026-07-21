"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { LoadingState } from "@/components/LoadingState";
import { PageHeader } from "@/components/PageHeader";
import { useSession } from "@/components/SessionContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { Overline } from "@/components/ui/Overline";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  getGlossary,
  type GlossaryLanguage,
  type GlossaryWord,
} from "@/lib/api/glossary";
import { LANGUAGES, languageOption, levelLabel } from "@/lib/lesson-catalog";

type GlossaryState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; languages: GlossaryLanguage[] };

function matchesQuery(word: GlossaryWord, query: string): boolean {
  if (!query) return true;
  const haystack = [word.headword, word.reading ?? "", ...word.gloss]
    .join(" ")
    .toLocaleLowerCase();
  return haystack.includes(query);
}

function addedLabel(value: string): string {
  const added = new Date(value);
  if (Number.isNaN(added.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(added);
}

const HEADWORD_FONT: Record<string, string> = {
  ja: "font-jp-serif",
  my: "font-myanmar",
  pl: "font-serif",
};

function WordRow({ word, language }: { word: GlossaryWord; language: string }) {
  return (
    <li className="-mx-2 flex flex-col gap-1.5 px-2 py-3 transition-colors hover:bg-tint sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4 sm:gap-y-1">
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <span
          className={`text-[15px] text-ink ${HEADWORD_FONT[language] ?? "font-serif"}`}
        >
          {word.headword}
        </span>
        {word.reading ? (
          <span className="font-mono text-[13px] text-ink-3">
            {word.reading}
          </span>
        ) : null}
      </span>
      <span className="text-sm text-ink sm:min-w-40 sm:flex-1">
        {word.gloss.join("; ")}
      </span>
      <span className="flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-3 sm:ml-auto">
        {word.level ? (
          <Badge tone="neutral">{levelLabel(language, word.level)}</Badge>
        ) : null}
        <span>
          {word.lessonCount} {word.lessonCount === 1 ? "lesson" : "lessons"}
        </span>
        <span>{addedLabel(word.addedAt)}</span>
      </span>
    </li>
  );
}

export function GlossaryView() {
  const session = useSession();
  const [state, setState] = useState<GlossaryState>({ kind: "loading" });
  const [languageFilter, setLanguageFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    getGlossary(session).then((result) => {
      if (!active) return;
      if (result.ok) {
        setState({ kind: "ready", languages: result.data });
      } else {
        setState({ kind: "error", message: result.error.message });
      }
    });
    return () => {
      active = false;
    };
  }, [session]);

  const header = (
    <PageHeader
      kicker="Glossary"
      title="Glossary"
      description="Every word your lessons have introduced so far."
    />
  );

  if (state.kind === "loading") {
    return (
      <div>
        {header}
        <LoadingState>Opening your glossary…</LoadingState>
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

  const populated = state.languages.filter((group) => group.words.length > 0);
  if (populated.length === 0) {
    return (
      <div>
        {header}
        <EmptyState
          description="Words are collected here the moment a lesson that uses them lands in your library. Create a lesson to start filling it."
          icon={<span className="font-jp-serif text-2xl text-ink-3">語</span>}
          title="No words yet"
        >
          <Link href="/create/">
            <Button>Create a lesson</Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  const query = search.trim().toLocaleLowerCase();
  const visible = populated
    .filter((group) => !languageFilter || group.language === languageFilter)
    .map((group) => ({
      ...group,
      words: group.words.filter((word) => matchesQuery(word, query)),
    }));
  const presentLanguages = LANGUAGES.filter((language) =>
    populated.some((group) => group.language === language.code),
  );
  const totalVisible = visible.reduce((sum, group) => sum + group.words.length, 0);

  return (
    <div>
      {header}
      <FilterBar
        languages={presentLanguages.map((language) => ({
          value: language.code,
          label: language.englishName,
          tone: language.tone,
        }))}
        activeLanguage={languageFilter}
        onLanguageChange={setLanguageFilter}
      >
        <SearchInput
          aria-label="Search words"
          className="min-w-44"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search words…"
          value={search}
        />
      </FilterBar>
      {visible.map((group) => {
        if (group.words.length === 0) return null;
        const option = languageOption(group.language);
        return (
          <section className="mb-8" key={group.language}>
            <div className="paper-grid sticky top-0 z-10 -mx-2 mb-1 flex items-baseline gap-3 px-2 py-2">
              <StatusDot tone={option?.tone ?? "neutral"} className="self-center" />
              <h2 className="font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">
                {option?.englishName ?? group.language}
              </h2>
              <Overline as="span">
                {group.words.length}{" "}
                {group.words.length === 1 ? "word" : "words"}
              </Overline>
            </div>
            <ul className="divide-y divide-line-2">
              {group.words.map((word) => (
                <WordRow
                  key={word.itemId}
                  language={group.language}
                  word={word}
                />
              ))}
            </ul>
          </section>
        );
      })}
      {totalVisible === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-2">
          No words match this search.
        </p>
      ) : null}
    </div>
  );
}
