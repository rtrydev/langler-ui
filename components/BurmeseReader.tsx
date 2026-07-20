"use client";

export function BurmeseReader({ passage }: { passage: string }) {
  return (
    <div className="space-y-[1.1em] font-myanmar text-[clamp(1.25rem,3vw,1.55rem)] leading-[2.1]">
      {passage.split(/\n+/).filter(Boolean).map((paragraph, paragraphIndex) => (
        <p key={`${paragraph.slice(0, 12)}-${paragraphIndex}`}>{paragraph}</p>
      ))}
    </div>
  );
}
