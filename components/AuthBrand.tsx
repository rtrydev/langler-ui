import { BrandMark } from "@/components/BrandMark";

export function AuthBrand() {
  return (
    <div className="mb-[26px] flex flex-col items-center gap-3 text-center">
      <BrandMark size={46} />
      <p className="text-2xl font-bold tracking-[-0.02em]">Langler</p>
      <p className="text-[13.5px] text-ink-2">
        Your languages. Your AI. One notebook.
      </p>
    </div>
  );
}
