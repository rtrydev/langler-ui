import { Button, Card, EmptyState, StatusCircle } from "langler-ui";

export const AllCaughtUp = () => (
  <Card className="w-[28rem]" padding="none">
    <EmptyState
      description="You're all caught up. Come back tomorrow — new items will be waiting."
      icon={<StatusCircle size="lg" tone="success">✓</StatusCircle>}
      title="Nothing due for review"
    />
  </Card>
);

export const EmptyLibrary = () => (
  <Card className="w-[28rem]" padding="none">
    <EmptyState
      description="Langler doesn't write lessons — your AI does. Build a prompt, paste it into any AI chat, and paste the JSON back."
      icon={<span className="font-jp-serif text-2xl text-ink-3">白</span>}
      title="No lessons yet"
    >
      <Button>Create a lesson</Button>
      <Button variant="ghost">See how it works</Button>
    </EmptyState>
  </Card>
);

export const TitleOnly = () => (
  <div className="w-[28rem]">
    <EmptyState title="No results for “czasownik”" />
  </div>
);
