"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionContext";
import { Button } from "@/components/ui/Button";
import { DrawingPad } from "@/components/ui/DrawingPad";
import { GlyphTile } from "@/components/ui/GlyphTile";
import { Switch } from "@/components/ui/Switch";
import { kanjiVGReference, listScriptGlyphs, strokeAssetUrl, type ScriptGlyph } from "@/lib/api/reference";
import { selfOutcome } from "@/lib/lesson-grading";
import { SelfAssessment } from "./SelfAssessment";
import type { ExercisePlayerProps } from "./types";

export function ScriptPracticeExercise({
  exercise,
  language,
  level,
  onComplete,
}: ExercisePlayerProps & { language: string; level: string }) {
  const session = useSession();
  const items = (exercise.payload?.items ?? []).filter((item): item is { glyph: string; reading?: string; meaning?: string } => typeof item !== "string");
  const [selected, setSelected] = useState(0);
  const [references, setReferences] = useState<ScriptGlyph[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [clearSignal, setClearSignal] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const item = items[selected];
  const reference = references.find((entry) => entry.glyph === item?.glyph);
  const strokeReference = reference?.strokeDataRef ?? kanjiVGReference(item?.glyph ?? "");
  const assetUrl = strokeReference ? strokeAssetUrl(strokeReference) : undefined;

  useEffect(() => {
    if (language !== "ja") return;
    let active = true;
    listScriptGlyphs(session, language, level).then((result) => {
      if (active && result.ok) setReferences(result.data);
    });
    return () => { active = false; };
  }, [language, level, session]);

  if (!item) return <p className="text-sm text-ink-2">No script items were provided.</p>;

  return (
    <div>
      <p className="text-sm text-ink-2">{exercise.prompt || "Trace the model, then write it yourself."}</p>
      <div className="mt-5 flex flex-wrap gap-2">{items.map((entry, index) => <Button className="font-jp text-lg" key={`${entry.glyph}-${index}`} onClick={() => { setSelected(index); setDrawn(false); setClearSignal(clearSignal + 1); }} variant={selected === index ? "primary" : "secondary"}>{entry.glyph}</Button>)}</div>
      <div className="mt-6 grid gap-7 md:grid-cols-[13rem_minmax(0,1fr)]">
        <div>
          <GlyphTile guides className="font-jp-serif text-8xl">{item.glyph}</GlyphTile>
          <p className="mt-3 text-center font-jp font-semibold">{item.reading}</p>
          <p className="text-center text-xs text-ink-3">{item.meaning}{reference?.strokeCount ? ` · ${reference.strokeCount} strokes` : ""}</p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">KanjiVG stroke order</p>
            <Switch checked={showGuide} onChange={(event) => setShowGuide(event.target.checked)}>Trace guide</Switch>
          </div>
          {assetUrl ? <object aria-label={`Stroke order for ${item.glyph}`} className="mt-3 h-36 w-36 rounded-lg border border-line bg-surface p-2" data={assetUrl} type="image/svg+xml" /> : <div className="mt-3 flex h-24 items-center text-xs text-ink-3">Stroke-order reference appears when the asset CDN is configured.</div>}
          <div className="mt-4 grid max-w-lg grid-cols-2 gap-3"><DrawingPad clearSignal={clearSignal} guide={showGuide ? item.glyph : undefined} onDraw={() => setDrawn(true)} /><DrawingPad clearSignal={clearSignal} onDraw={() => setDrawn(true)} /></div>
          <Button className="mt-3" onClick={() => { setClearSignal(clearSignal + 1); setDrawn(false); }} variant="secondary">Clear</Button>
        </div>
      </div>
      {drawn ? <SelfAssessment rating={rating} onChange={setRating} onContinue={() => rating !== null && onComplete(selfOutcome(exercise, rating))} /> : null}
    </div>
  );
}
