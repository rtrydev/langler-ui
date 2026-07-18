import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Overline } from "@/components/ui/Overline";

export default function Home() {
  return (
    <div className="grid gap-8">
      <div>
        <Heading as="h1" size="lg">
          Your notebook
        </Heading>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
          Bring your own AI to write lessons; Langler validates, stores, and
          plays them.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link className="group" href="/create/">
          <Card className="h-full transition-colors group-hover:border-accent-border" elevation="card">
            <Overline className="mb-2">Create</Overline>
            <p className="text-[15px] font-semibold">Create a lesson</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
              Pick a language, level, and topic. Copy the generated prompt into
              any AI chat and paste the JSON back.
            </p>
          </Card>
        </Link>
        <Link className="group" href="/lessons/">
          <Card className="h-full transition-colors group-hover:border-accent-border" elevation="card">
            <Overline className="mb-2">Library</Overline>
            <p className="text-[15px] font-semibold">Your lessons</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
              Browse imported lessons, open one, or clear out what you no
              longer need.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
