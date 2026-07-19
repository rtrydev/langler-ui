import { OptionCard } from "langler-ui";

export const MultipleChoice = () => (
  <div className="grid w-96 gap-2">
    <p className="text-sm text-ink-2">
      How do you say <span className="font-semibold text-ink">ticket</span>?
    </p>
    <OptionCard className="font-jp py-3">駅</OptionCard>
    <OptionCard className="font-jp py-3" selected>切符</OptionCard>
    <OptionCard className="font-jp py-3">電車</OptionCard>
    <OptionCard className="font-jp py-3">改札</OptionCard>
  </div>
);

export const MatchingPairs = () => (
  <div className="grid w-96 grid-cols-2 gap-2">
    <OptionCard className="font-jp text-base" selected>
      水
      <span className="mt-1 block font-sans text-xs text-ink-3">water</span>
    </OptionCard>
    <OptionCard className="font-jp text-base">
      山
      <span className="mt-1 block font-sans text-xs text-ink-3">
        Choose a match
      </span>
    </OptionCard>
    <OptionCard>mountain</OptionCard>
    <OptionCard disabled>water</OptionCard>
  </div>
);

export const WizardTiles = () => (
  <div className="grid w-96 gap-2">
    <OptionCard selected>
      <span className="text-sm font-bold text-ink">
        <span className="font-jp">日本語</span> Japanese
      </span>
      <span className="mt-1 block text-xs text-ink-3">
        JLPT levels N5–N1 · kana and kanji support
      </span>
    </OptionCard>
    <OptionCard>
      <span className="text-sm font-bold text-ink">
        <span className="font-myanmar">မြန်မာ</span> Burmese
      </span>
      <span className="mt-1 block text-xs text-ink-3">
        CEFR levels A1–C2 · Myanmar script
      </span>
    </OptionCard>
    <OptionCard>
      <span className="text-sm font-bold text-ink">Polski Polish</span>
      <span className="mt-1 block text-xs text-ink-3">
        CEFR levels A1–C2 · Latin script
      </span>
    </OptionCard>
  </div>
);
