import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeControl } from "@/components/ThemeControl";
import { Card } from "@/components/ui/Card";
import { Overline } from "@/components/ui/Overline";
import { AssessmentHistory } from "./_components/AssessmentHistory";
import { TokenManager } from "./_components/TokenManager";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        description="Pair your own AI with scoped, expiring credentials."
        kicker="Settings"
        title="Settings"
      />
      <Link
        className="mb-10 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-5 text-[13px] font-semibold text-accent shadow-card transition-all duration-150 hover:-translate-y-px hover:border-accent-border hover:bg-accent-soft hover:text-accent-hover hover:shadow-raised"
        href="/connect/"
      >
        Connect your agent →
      </Link>
      <TokenManager />
      <AssessmentHistory />
      <section className="mt-10">
        <div className="mb-3">
          <Overline as="h2">Appearance</Overline>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            Follow your system, or pick a side.
          </p>
        </div>
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-[540] text-ink">Theme</span>
          <ThemeControl />
        </Card>
      </section>
      <section className="mt-10">
        <div className="mb-3">
          <Overline as="h2">Account</Overline>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            You stay signed in on this device until you sign out.
          </p>
        </div>
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-[540] text-ink">Session</span>
          <SignOutButton />
        </Card>
      </section>
    </div>
  );
}
