import { Button } from "langler-ui";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Start lesson</Button>
    <Button variant="secondary">Save draft</Button>
    <Button variant="accent">Review vocabulary</Button>
    <Button variant="ghost">Skip</Button>
    <Button variant="danger">Delete lesson</Button>
    <Button variant="contrast">Continue</Button>
    <Button variant="link">View all lessons</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="sm">Retry</Button>
    <Button size="md">Check answer</Button>
    <Button size="lg">Begin placement test</Button>
  </div>
);

export const States = () => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Check answer</Button>
      <Button variant="secondary" disabled>
        Save draft
      </Button>
    </div>
    <div className="w-72">
      <Button fullWidth variant="contrast">
        Got it
      </Button>
    </div>
  </div>
);
