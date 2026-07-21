import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { GlyphTile } from "@/components/ui/GlyphTile";
import { Heading } from "@/components/ui/Heading";
import { harnessAssets } from "@/lib/harness";
import { HarnessPanel } from "./_components/HarnessPanel";

const steps = [
  {
    title: "Create a token",
    text: "Choose both read reference and import lessons so the agent can ground and deliver the lesson.",
  },
  {
    title: "Pair it privately",
    text: "Set the secret as LANGLER_TOKEN in the agent process. Langler shows it only once.",
  },
  {
    title: "Ask for a lesson",
    text: "The harness makes connected reading the default, retrieves targets, validates, and imports to your library.",
  },
];

export default function ConnectPage() {
  const machineApiUrl = process.env.NEXT_PUBLIC_MACHINE_API_URL;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        kicker="Connect"
        title="Connect your agent"
        description="Give a coding agent the framework-agnostic harness and a scoped token, and it can ground, compose, and import lessons through the Langler API."
      />

      <div
        aria-hidden
        className="mb-6 flex items-center gap-3 rounded-xl border border-line bg-surface p-4 sm:gap-5 sm:p-5"
      >
        <div className="flex-1 text-center">
          <GlyphTile className="mx-auto size-16 font-mono text-lg font-bold text-ink">
            {">_"}
          </GlyphTile>
          <div className="mt-2 text-xs font-semibold">Your agent</div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="w-full border-t border-dashed border-accent-border" />
          <span className="font-mono text-[10px] tracking-wide whitespace-nowrap text-accent">
            HTTPS · Bearer
          </span>
        </div>
        <div className="flex-1 text-center">
          <GlyphTile className="mx-auto size-16 font-jp-serif text-2xl text-accent">
            語
          </GlyphTile>
          <div className="mt-2 text-xs font-semibold">Langler API</div>
        </div>
      </div>

      <Card className="mb-6">
        <Heading as="h2" className="mb-4" size="sm">Download the harness</Heading>
        <HarnessPanel assets={harnessAssets(machineApiUrl)} />
      </Card>

      <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line">
        {steps.map((step, index) => (
          <li className="flex gap-3 bg-surface p-4" key={step.title}>
            <span className="shrink-0 font-mono text-xs font-bold text-accent">
              {index + 1}
            </span>
            <p className="text-[13px] leading-relaxed text-ink-2">
              <strong className="text-ink">{step.title}.</strong> {step.text}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[13px] text-ink-2">
        Ready to pair?{" "}
        <Link className="font-semibold text-accent hover:text-accent-hover" href="/settings/">
          Create an agent token
        </Link>
        .
      </p>
    </div>
  );
}
