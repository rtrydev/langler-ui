import { BrandMark } from "@/components/BrandMark";

export function AuthBrand() {
  return (
    <div className="mb-6 flex flex-col items-center gap-3 text-center">
      <BrandMark size={46} />
      <p className="font-display text-2xl font-semibold tracking-[-0.02em]">
        Langler
      </p>
      <p className="font-mono text-[12px] text-ink-3">
        Your languages. Your AI. One notebook.
      </p>
    </div>
  );
}
