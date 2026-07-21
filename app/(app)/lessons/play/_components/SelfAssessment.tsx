import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { OptionCard } from "@/components/ui/OptionCard";

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
    <Card className="mt-6 bg-surface-2" elevation="flat">
      <p className="text-sm font-semibold">How did that feel?</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {["Not yet", "With help", "Mostly", "Confident"].map((label, index) => (
          <OptionCard
            className="py-3 text-center text-sm font-medium"
            key={label}
            onClick={() => onChange(index + 1)}
            selected={rating === index + 1}
          >
            {label}
          </OptionCard>
        ))}
      </div>
      <Button className="mt-4" disabled={rating === null} onClick={onContinue} size="lg">
        Continue →
      </Button>
    </Card>
  );
}
