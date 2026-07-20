"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  getGlossary,
  type GlossaryLanguage,
  type GlossaryWord,
} from "@/lib/api/glossary";
import { LANGUAGES, levelLabel } from "@/lib/lesson-catalog";

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

function WordRow({ word, language }: { word: GlossaryWord; language: string }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line-2 py-3 last:border-b-0">
      <span className="font-jp-serif text-xl text-ink">{word.headword}</span>
      {word.reading ? (
        <span className="text-sm text-ink-2">{word.reading}</span>
      ) : null}
      <span className="min-w-40 flex-1 text-sm text-ink">
        {word.gloss.join("; ")}
      </span>
      <span className="ml-auto flex items-baseline gap-3 text-[11px] text-ink-3">
        {word.level ? <span>{levelLabel(language, word.level)}</span> : null}
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
    <div className="mb-6">
      <Heading as="h1" size="lg">
        Glossary
      </Heading>
      <p className="mt-1 text-sm text-ink-2">
        Every word your lessons have introduced so far.
      </p>
    </div>
  );

  if (state.kind === "loading") {
    return (
      <div>
        {header}
        <p className="font-mono text-sm text-ink-2" role="status">
          Opening your glossary…
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
      <div className="mb-5 flex flex-wrap gap-2">
        {presentLanguages.length > 1 ? (
          <>
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
          </>
        ) : null}
        <SearchInput
          aria-label="Search words"
          className="min-w-44 flex-1"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search words…"
          value={search}
        />
      </div>
      {visible.map((group) => {
        if (group.words.length === 0) return null;
        const option = LANGUAGES.find(
          (language) => language.code === group.language,
        );
        return (
          <section className="mb-8" key={group.language}>
            <div className="mb-1 flex items-baseline gap-3">
              <Heading as="h2" size="sm">
                {option?.englishName ?? group.language}
              </Heading>
              <span className="text-xs text-ink-3">
                {group.words.length}{" "}
                {group.words.length === 1 ? "word" : "words"}
              </span>
            </div>
            <ul>
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
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-2">
          No words match this search.
        </p>
      ) : null}
    </div>
  );
}
