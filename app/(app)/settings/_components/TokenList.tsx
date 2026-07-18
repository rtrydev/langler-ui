"use client";

import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AgentToken } from "@/lib/api/agent-tokens";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const statusTone: Record<AgentToken["status"], BadgeTone> = {
  active: "success",
  expired: "muted",
  revoked: "crimson",
};

export function TokenList({
  tokens,
  revoking,
  onRevoke,
}: {
  tokens: AgentToken[];
  revoking?: string;
  onRevoke: (token: AgentToken) => void;
}) {
  if (tokens.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-ink-2">
        No agent tokens yet.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-line-2">
      {tokens.map((token) => (
        <li
          className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_9rem_5rem_auto] sm:items-center"
          key={token.id}
        >
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold text-ink">
              {token.label}
              <span className="ml-2 font-mono text-[11px] font-normal text-ink-3">
                ••••{token.suffix}
              </span>
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {token.scopes.map((scope) => (
                <Badge key={scope}>{scope.replace("-", " ")}</Badge>
              ))}
            </div>
          </div>
          <div className="text-xs text-ink-2">
            <span className="mr-1 text-ink-3 sm:hidden">Last used:</span>
            {token.lastUsed ? dateFormat.format(new Date(token.lastUsed)) : "Never"}
          </div>
          <div>
            <Badge tone={statusTone[token.status]}>
              {token.status[0].toUpperCase() + token.status.slice(1)}
            </Badge>
          </div>
          <div className="sm:text-right">
            {token.status === "active" ? (
              <Button
                disabled={revoking === token.id}
                onClick={() => onRevoke(token)}
                size="sm"
                variant="danger"
              >
                {revoking === token.id ? "Revoking…" : "Revoke"}
              </Button>
            ) : (
              <span className="text-xs text-ink-3">Expires {dateFormat.format(new Date(token.expiresAt))}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
