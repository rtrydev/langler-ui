"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { clearSession } from "@/lib/auth/cognito";
import { cn } from "@/lib/cn";

type AppShellProps = { onSignOut: () => void; children: ReactNode };

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" },
  {
    href: "/lessons/",
    label: "Lessons",
    icon: "M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2zM5 4v14",
  },
  {
    href: "/create/",
    label: "Create",
    icon: "M4 20l1-4L16 5l3 3L8 19zM14 7l3 3",
  },
  {
    href: "/review/",
    label: "Review",
    icon: "M8 5h11v11M4 8h11v11H4z",
  },
  {
    href: "/glossary/",
    label: "Glossary",
    icon: "M4 6h16M4 10h10M4 14h16M4 18h8",
  },
  {
    href: "/settings/",
    label: "Settings",
    icon: "M4 8h16M4 16h16M9 8V6m0 4V8m6 8v2m0-6v6",
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href.replace(/\/$/, ""));
}

function NavIcon({ path, active }: { path: string; active: boolean }) {
  return (
    <svg
      aria-hidden
      className={active ? "stroke-accent" : "stroke-ink-2"}
      fill="none"
      height="19"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      width="19"
    >
      <path d={path} />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark size={28} />
      <span className="text-lg font-bold tracking-tight text-ink">Langler</span>
    </span>
  );
}

export function AppShell({ onSignOut, children }: AppShellProps) {
  const pathname = usePathname();

  function signOut() {
    clearSession();
    onSignOut();
  }

  return (
    <div className="min-h-screen bg-paper md:flex">
      <nav
        aria-label="Primary"
        className="sticky top-0 hidden h-screen w-[236px] shrink-0 flex-col overflow-y-auto border-r border-line bg-surface px-4 py-[22px] md:flex"
      >
        <div className="px-2.5 pb-[22px]">
          <Wordmark />
        </div>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-[9px] text-sm",
                  active
                    ? "bg-accent-soft font-semibold text-accent"
                    : "font-medium text-ink hover:bg-tint",
                )}
                href={item.href}
                key={item.href}
              >
                <NavIcon active={active} path={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex-1" />
        <div className="mt-2 border-t border-line pt-3">
          <Button fullWidth onClick={signOut} variant="ghost">
            Sign out
          </Button>
        </div>
      </nav>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-surface px-5 py-3 md:hidden">
          <Wordmark />
          <Button onClick={signOut} size="sm" variant="ghost">
            Sign out
          </Button>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 pb-24 md:px-11 md:pb-8">
          {children}
        </main>

        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 flex h-16 items-stretch justify-around border-t border-line bg-surface/95 pb-1.5 backdrop-blur md:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                className="flex flex-1 flex-col items-center justify-center gap-1 pt-2"
                href={item.href}
                key={item.href}
              >
                <NavIcon active={active} path={item.icon} />
                <span
                  className={cn(
                    "text-[10.5px]",
                    active ? "font-semibold text-accent" : "font-medium text-ink-3",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
