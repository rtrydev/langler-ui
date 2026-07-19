import { FieldMessage, Input, Label } from "langler-ui";

export const Tones = () => (
  <div className="flex w-72 flex-col gap-2">
    <FieldMessage>Shown on your worksheets and progress reports.</FieldMessage>
    <FieldMessage tone="error">
      That lesson JSON is missing an exercises array.
    </FieldMessage>
    <FieldMessage tone="success">
      Token created — copy it now, it won&apos;t be shown again.
    </FieldMessage>
  </div>
);

export const InField = () => (
  <div className="w-72">
    <Label htmlFor="token-label">Label</Label>
    <Input id="token-label" defaultValue="" invalid maxLength={80} />
    <FieldMessage tone="error">Give the token a label.</FieldMessage>
  </div>
);

export const HelperText = () => (
  <div className="w-72">
    <Label htmlFor="lesson-topic">Topic</Label>
    <Input id="lesson-topic" placeholder="e.g. Weather small talk" />
    <FieldMessage>
      Optional — leave blank and we&apos;ll pick one for your level.
    </FieldMessage>
  </div>
);
