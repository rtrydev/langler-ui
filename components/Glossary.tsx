import { glossaryEntries, type Annotation } from "@/lib/glossary";

const surfaceFont: Record<string, string> = {
  ja: "font-jp",
  my: "font-myanmar",
};

export function Glossary({ annotations = [], language }: {
  annotations?: Annotation[];
  language: string;
}) {
  const entries = glossaryEntries(annotations);
  if (!entries.length) return null;

  return (
    <section aria-label="Vocabulary" className="mt-7 border-t border-line-2 pt-5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Vocabulary</p>
      <dl className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
        {entries.map((item) => (
          <div className="flex flex-wrap items-baseline gap-x-2" key={item.surface}>
            <dt className={`text-lg leading-snug ${surfaceFont[language] ?? "font-serif"}`}>{item.surface}</dt>
            {item.reading ? <span className="text-xs text-ink-3">{item.reading}</span> : null}
            <dd className="text-sm text-ink-2">{item.gloss}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
