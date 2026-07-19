import { Input } from "langler-ui";

export const Basic = () => (
  <div className="flex w-96 flex-col gap-3">
    <Input placeholder="e.g. Ordering food at an izakaya" />
    <Input defaultValue="Asking for directions in Kraków" maxLength={120} />
  </div>
);

export const States = () => (
  <div className="flex w-96 flex-col gap-3">
    <Input defaultValue="jlpt-n6" invalid />
    <Input defaultValue="Renewing a visa at immigration" disabled />
  </div>
);

export const ExerciseBlank = () => (
  <p className="w-96 font-jp text-lg text-ink">
    毎朝、パンを
    <span className="mx-1 inline-block w-36">
      <Input
        aria-label="Blank 1"
        className="rounded-b-none border-x-0 border-t-0 border-accent bg-accent-soft px-2 text-center font-jp text-lg"
        defaultValue="食べます"
      />
    </span>
    。
  </p>
);
