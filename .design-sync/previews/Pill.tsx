import { Pill } from "langler-ui";

export const LanguageFilter = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Pill selected>All languages</Pill>
    <Pill>
      <span className="font-jp">日本語</span> Japanese
    </Pill>
    <Pill>
      <span className="font-myanmar">မြန်မာ</span> Burmese
    </Pill>
    <Pill>Polski Polish</Pill>
  </div>
);

export const SelectedTones = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Pill selected tone="accent">Due today</Pill>
    <Pill selected tone="vermilion">Japanese</Pill>
    <Pill selected tone="gold">Burmese</Pill>
    <Pill selected tone="crimson">Polish</Pill>
  </div>
);

export const TopicChips = () => (
  <div className="flex w-96 flex-wrap gap-2">
    <Pill selected tone="vermilion">Ordering food</Pill>
    <Pill>Train travel</Pill>
    <Pill>Counting money</Pill>
    <Pill>Weather small talk</Pill>
    <Pill>At the pharmacy</Pill>
  </div>
);
