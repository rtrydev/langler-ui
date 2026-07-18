import Link from "next/link";
import { Card } from "@/components/ui/Card";
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
      <Heading as="h1" size="lg">Connect your agent</Heading>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
        Give a coding agent the framework-agnostic harness and a scoped token,
        and it can ground, compose, and import lessons through the Langler API.
      </p>

      <div className="my-6 flex items-center gap-3 rounded-xl border border-line bg-surface p-4 sm:gap-5 sm:p-5">
        <div className="flex-1 rounded-[9px] border border-line bg-paper p-3 text-center">
          <div aria-hidden className="text-2xl">🤖</div>
          <div className="mt-1 text-xs font-semibold">Your agent</div>
        </div>
        <div aria-hidden className="font-mono text-xl text-accent">⇄</div>
        <div className="flex-1 rounded-[9px] border border-line bg-paper p-3 text-center">
          <div aria-hidden className="font-jp-serif text-2xl text-accent">語</div>
          <div className="mt-1 text-xs font-semibold">Langler API</div>
        </div>
      </div>

      <Card className="mb-6">
        <Heading as="h2" className="mb-4" size="sm">Download the harness</Heading>
        <HarnessPanel assets={harnessAssets(machineApiUrl)} />
      </Card>

      <ol className="grid gap-3">
        {steps.map((step, index) => (
          <li className="flex gap-3" key={step.title}>
            <span className="grid size-[22px] shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-on-accent">
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
