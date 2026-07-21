"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";
import { cn } from "@/lib/cn";

type AppShellProps = { children: ReactNode };

const SETTINGS_ITEM = {
  href: "/settings/",
  label: "Settings",
  icon: "M4 8h16M4 16h16M9 8V6m0 4V8m6 8v2m0-6v6",
};

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
  SETTINGS_ITEM,
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
      height="18"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d={path} />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark size={28} />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Langler
      </span>
    </span>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const settingsActive = isActive(pathname, SETTINGS_ITEM.href);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-paper print:static print:block print:overflow-visible">
      <nav
        aria-label="Primary"
        className="hidden h-full w-[236px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-line bg-paper-2 px-4 py-[22px] md:flex"
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
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-[540] transition-colors",
                  active
                    ? "bg-accent-soft text-accent-strong before:absolute before:top-1/2 before:left-0 before:h-5 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:bg-accent"
                    : "text-ink hover:bg-tint",
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
      </nav>

      <div className="flex h-full min-h-0 flex-1 flex-col print:block print:h-auto">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-paper px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 md:hidden">
          <Wordmark />
          <Link
            aria-label="Settings"
            className={cn(
              "flex size-9 items-center justify-center rounded-md transition-colors",
              settingsActive ? "bg-accent-soft" : "hover:bg-tint",
            )}
            href={SETTINGS_ITEM.href}
          >
            <NavIcon active={settingsActive} path={SETTINGS_ITEM.icon} />
          </Link>
        </header>

        <main className="paper-grid min-h-0 flex-1 overflow-y-auto overscroll-contain print:h-auto print:overflow-visible">
          {/* relative keeps unanchored absolute descendants (e.g. sr-only
              boxes) inside the scroll content instead of the fixed shell,
              where their overflow makes focus scroll-jump the whole app. */}
          <div className="relative mx-auto w-full max-w-5xl px-5 py-8 md:px-11">
            {children}
          </div>
        </main>

        <nav
          aria-label="Primary"
          className="flex shrink-0 items-stretch justify-around border-t border-line bg-paper pb-[calc(env(safe-area-inset-bottom)+0.875rem)] md:hidden"
        >
          {NAV_ITEMS.filter((item) => item !== SETTINGS_ITEM).map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                className="flex flex-1 flex-col items-center justify-center gap-1 pt-2.5"
                href={item.href}
                key={item.href}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1 w-6 rounded-full transition-colors",
                    active ? "bg-accent" : "bg-transparent",
                  )}
                />
                <NavIcon active={active} path={item.icon} />
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.08em] uppercase",
                    active ? "text-accent" : "text-ink-3",
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
