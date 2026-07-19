import { Heading, Overline } from "langler-ui";

export const Sizes = () => (
  <div className="flex w-96 flex-col gap-4">
    <Heading as="h4" size="sm">Agent tokens</Heading>
    <Heading as="h3" size="md">Session complete</Heading>
    <Heading as="h2" size="lg">Your notebook</Heading>
    <Heading as="h1" size="xl">Find your level</Heading>
  </div>
);

export const PageHeader = () => (
  <div className="w-96">
    <Overline>Placement · Japanese</Overline>
    <Heading as="h1" className="mt-1.5" size="lg">
      Find your level
    </Heading>
    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
      A short adaptive test estimates your JLPT band and seeds your lesson
      defaults. It takes about five minutes.
    </p>
  </div>
);
