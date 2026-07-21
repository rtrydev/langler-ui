"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Ruby } from "@/components/ui/Ruby";
import type { VocabEntry } from "@/lib/api/reference";

type Annotation = { surface: string; reading?: string; gloss?: string };
type Definition = { surface: string; reading?: string; gloss: string; detail?: string };

export function JapaneseReader({
  passage,
  annotations = [],
  vocabulary = [],
  showReadings,
}: {
  passage: string;
  annotations?: Annotation[];
  vocabulary?: VocabEntry[];
  showReadings: boolean;
}) {
  const [definition, setDefinition] = useState<Definition | null>(null);
  const annotationMap = new Map(annotations.map((item) => [item.surface, item]));
  const vocabularyMap = new Map(vocabulary.map((item) => [item.headword, item]));
  const segmenter = new Intl.Segmenter("ja", { granularity: "word" });

  return (
    <div className="relative">
      <div className="space-y-[1.1em] font-jp-serif text-[clamp(1.15rem,3vw,1.4rem)] leading-[2.35]">
        {passage.split(/\n+/).filter(Boolean).map((paragraph, paragraphIndex) => (
          <p key={`${paragraph.slice(0, 12)}-${paragraphIndex}`}>
            {Array.from(segmenter.segment(paragraph)).map((part, index) => {
              const annotation = annotationMap.get(part.segment);
              const vocab = vocabularyMap.get(part.segment);
              const reading = annotation?.reading ?? vocab?.reading;
              const gloss = annotation?.gloss ?? vocab?.gloss?.[0];
              const content = showReadings && reading ? <Ruby reading={reading}>{part.segment}</Ruby> : part.segment;
              return gloss ? (
                <button
                  className="rounded-sm border-b border-dotted border-accent px-px text-inherit text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  key={`${part.segment}-${index}`}
                  onClick={() => setDefinition({ surface: part.segment, reading, gloss, detail: vocab?.pos?.join(" · ") })}
                  type="button"
                >
                  {content}
                </button>
              ) : <span key={`${part.segment}-${index}`}>{content}</span>;
            })}
          </p>
        ))}
      </div>
      {definition ? (
        <Card className="sticky bottom-3 z-10 mt-5" elevation="glass">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-jp-serif text-3xl">{definition.surface}</p>
              {definition.reading ? <p className="mt-1 font-jp text-sm text-ink-2">{definition.reading}</p> : null}
            </div>
            <button aria-label="Close definition" className="text-lg text-ink-3" onClick={() => setDefinition(null)} type="button">×</button>
          </div>
          <p className="mt-3 text-sm leading-relaxed">{definition.gloss}</p>
          {definition.detail ? <p className="mt-2 text-xs text-ink-3">{definition.detail}</p> : null}
        </Card>
      ) : null}
    </div>
  );
}
