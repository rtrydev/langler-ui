"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ruby } from "@/components/ui/Ruby";
import type { VocabEntry } from "@/lib/api/reference";
import { loadBurmeseSegmenter } from "@/lib/api/reference-assets";
import { refineSegments, segmentBurmese, type NgramModel } from "@/lib/burmese/segmenter";

type Annotation = { surface: string; reading?: string; gloss?: string };
type Definition = { surface: string; reading?: string; gloss: string; detail?: string };

export function BurmeseReader({ passage, annotations = [], vocabulary = [], showReadings }: {
  passage: string;
  annotations?: Annotation[];
  vocabulary?: VocabEntry[];
  showReadings: boolean;
}) {
  const assetsBase = process.env.NEXT_PUBLIC_REFERENCE_ASSETS_URL;
  const modelUrl = assetsBase ? `${assetsBase.replace(/\/$/, "")}/burmese/myword-ngram.json` : undefined;
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [model, setModel] = useState<NgramModel>();
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "unavailable">(modelUrl ? "loading" : "unavailable");
  const annotationMap = new Map(annotations.map((item) => [item.surface, item]));
  const vocabularyMap = new Map(vocabulary.map((item) => [item.headword, item]));
  const surfaces = [...annotationMap.keys(), ...vocabularyMap.keys()];

  useEffect(() => {
    if (!modelUrl) return;
    let active = true;
    loadBurmeseSegmenter(modelUrl).then((loaded) => {
      if (active) {
        setModel(loaded);
        setModelStatus("ready");
      }
    }).catch(() => {
      if (active) setModelStatus("unavailable");
    });
    return () => { active = false; };
  }, [modelUrl]);

  function tokens(paragraph: string): string[] {
    if (model) return refineSegments(segmentBurmese(model, paragraph), surfaces);
    return refineSegments([paragraph], surfaces);
  }

  return (
    <div className="relative">
      {modelStatus === "loading" ? <p aria-live="polite" className="mb-3 text-xs text-ink-3">Preparing Burmese word boundaries…</p> : null}
      {modelStatus === "unavailable" ? <p className="mb-3 text-xs text-ink-3">Word help is limited to the lesson annotations.</p> : null}
      <div className="space-y-[1.1em] font-myanmar text-[clamp(1.25rem,3vw,1.55rem)] leading-[2.65]">
        {passage.split(/\n+/).filter(Boolean).map((paragraph, paragraphIndex) => (
          <p key={`${paragraph.slice(0, 12)}-${paragraphIndex}`}>
            {tokens(paragraph).map((token, index) => {
              const annotation = annotationMap.get(token);
              const vocab = vocabularyMap.get(token);
              const reading = annotation?.reading ?? vocab?.reading;
              const gloss = annotation?.gloss ?? vocab?.gloss?.[0];
              const content = showReadings && reading ? <Ruby reading={reading}>{token}</Ruby> : token;
              return gloss ? (
                <button
                  className="rounded-sm border-b border-dotted border-accent px-px text-inherit text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  key={`${token}-${index}`}
                  onClick={() => setDefinition({ surface: token, reading, gloss, detail: vocab?.pos?.join(" · ") })}
                  type="button"
                >
                  {content}
                </button>
              ) : <span key={`${token}-${index}`}>{content}</span>;
            })}
          </p>
        ))}
      </div>
      {definition ? (
        <Card className="sticky bottom-3 z-10 mt-5 shadow-raised" elevation="raised">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-myanmar text-3xl leading-relaxed">{definition.surface}</p>
              {definition.reading ? <p className="mt-1 text-sm text-ink-2">{definition.reading}</p> : null}
            </div>
            <Button aria-label="Close definition" onClick={() => setDefinition(null)} size="sm" variant="ghost">×</Button>
          </div>
          <p className="mt-3 text-sm leading-relaxed">{definition.gloss}</p>
          {definition.detail ? <p className="mt-2 text-xs text-ink-3">{definition.detail}</p> : null}
        </Card>
      ) : null}
    </div>
  );
}
