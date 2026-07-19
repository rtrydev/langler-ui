import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { AssessmentHistory } from "./_components/AssessmentHistory";
import { TokenManager } from "./_components/TokenManager";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Heading as="h1" size="lg">Settings</Heading>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-2">
            Pair your own AI with scoped, expiring credentials.
          </p>
        </div>
        <Link className="text-[13px] font-semibold text-accent hover:text-accent-hover" href="/connect/">
          Connect your agent →
        </Link>
      </div>
      <TokenManager />
      <AssessmentHistory />
    </div>
  );
}
