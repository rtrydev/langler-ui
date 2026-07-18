"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getHello, type HelloResponse } from "@/lib/api/hello";
import { clearSession, type AuthSession } from "@/lib/auth/cognito";

type AppShellProps = { session: AuthSession; onSignOut: () => void };

export function AppShell({ session, onSignOut }: AppShellProps) {
  const [hello, setHello] = useState<HelloResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getHello(session).then((result) => {
      if (!active) return;
      if (result.ok) {
        setHello(result.data);
      } else {
        setError(result.error.message);
      }
    });
    return () => { active = false; };
  }, [session]);

  function signOut() {
    clearSession();
    onSignOut();
  }

  const status = hello ? "Connected" : error ? "Unavailable" : "Checking…";
  const statusClass = hello ? "bg-success-soft text-success" : error ? "bg-vermilion-soft text-vermilion-strong" : "bg-tint text-ink-2";

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-serif text-xl font-semibold tracking-tight">Langler</span>
          <Button onClick={signOut} variant="secondary">Sign out</Button>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-12">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">Foundation online</p>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Your language notebook</h1>
          <p className="mt-3 max-w-2xl text-ink-2">The secure shell is ready. Lessons and study tools arrive in the next build.</p>
        </div>
        <section className="rounded-lg border border-line bg-surface p-6 shadow-card" aria-labelledby="api-status">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-serif text-xl font-semibold" id="api-status">Authenticated API</h2>
              <p className="mt-1 text-sm text-ink-2">Cognito JWT → HTTP API → Go Lambda</p>
            </div>
            <span className={`rounded-full px-3 py-1 font-mono text-xs ${statusClass}`}>{status}</span>
          </div>
          {hello ? <p className="mt-6 rounded-md bg-tint px-4 py-3 font-mono text-sm">{hello.message} · {hello.service} · {hello.stage}</p> : null}
          {error ? <p className="mt-6 text-sm text-vermilion-strong" role="alert">{error}</p> : null}
        </section>
      </main>
    </div>
  );
}
