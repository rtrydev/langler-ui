import { Button } from "@/components/ui/Button";

export function SelfAssessment({
  rating,
  onChange,
  onContinue,
}: {
  rating: number | null;
  onChange: (rating: number) => void;
  onContinue: () => void;
}) {
  return (
    <div className="mt-6 rounded-xl border border-line bg-paper p-4">
      <p className="text-sm font-semibold">How did that feel?</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {["Not yet", "With help", "Mostly", "Confident"].map((label, index) => (
          <Button
            aria-pressed={rating === index + 1}
            key={label}
            onClick={() => onChange(index + 1)}
            variant={rating === index + 1 ? "primary" : "secondary"}
          >
            {label}
          </Button>
        ))}
      </div>
      <Button className="mt-4" disabled={rating === null} onClick={onContinue}>
        Continue →
      </Button>
    </div>
  );
}
