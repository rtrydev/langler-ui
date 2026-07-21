"use client";

import { useSyncExternalStore } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  getServerTheme,
  getStoredTheme,
  setStoredTheme,
  subscribeTheme,
  type ThemePreference,
} from "@/lib/theme";

const icon = "size-4";

function SystemIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  );
}

function DarkIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon}>
      <path d="M20 14.5A8 8 0 019.5 4a7 7 0 108.5 10.5z" />
    </svg>
  );
}

const OPTIONS = [
  { value: "system", label: <SystemIcon />, name: "System" },
  { value: "light", label: <LightIcon />, name: "Light" },
  { value: "dark", label: <DarkIcon />, name: "Dark" },
];

export function ThemeControl({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    getServerTheme,
  );

  function change(value: string) {
    setStoredTheme(value as ThemePreference);
  }

  return (
    <div role="group" aria-label="Theme" className={className}>
      <SegmentedControl
        name="langler-theme"
        value={theme}
        onValueChange={change}
        options={OPTIONS.map((option) => ({
          value: option.value,
          label: (
            <>
              {option.label}
              <span className="sr-only">{option.name}</span>
            </>
          ),
        }))}
      />
    </div>
  );
}
