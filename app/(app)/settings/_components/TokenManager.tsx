"use client";

import { useEffect, useState } from "react";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { useSession } from "@/components/SessionContext";
import {
  createAgentToken,
  listAgentTokens,
  revokeAgentToken,
  type AgentToken,
} from "@/lib/api/agent-tokens";
import type { AgentTokenInput } from "@/lib/validation/agent-token";
import { TokenCreateForm } from "./TokenCreateForm";
import { TokenList } from "./TokenList";
import { TokenReveal } from "./TokenReveal";

export function TokenManager() {
  const session = useSession();
  const [tokens, setTokens] = useState<AgentToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    async function load() {
      const result = await listAgentTokens(session);
      if (!active) return;
      if (result.ok) setTokens(result.data);
      else setError(result.error.message);
      setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
  }, [session]);

  async function create(input: AgentTokenInput) {
    setCreating(true);
    setError(undefined);
    const result = await createAgentToken(session, input);
    if (result.ok) {
      setTokens((current) => [result.data.token, ...current]);
      setSecret(result.data.secret);
    } else {
      setError(result.error.message);
    }
    setCreating(false);
  }

  async function revoke(token: AgentToken) {
    if (!window.confirm(`Revoke “${token.label}”? It will stop working immediately.`)) {
      return;
    }
    setRevoking(token.id);
    setError(undefined);
    const result = await revokeAgentToken(session, token.id);
    if (result.ok) {
      setTokens((current) =>
        current.map((item) =>
          item.id === token.id ? { ...item, status: "revoked" } : item,
        ),
      );
    } else {
      setError(result.error.message);
    }
    setRevoking(undefined);
  }

  return (
    <div className="grid gap-6">
      {secret ? <TokenReveal onDismiss={() => setSecret(undefined)} secret={secret} /> : null}
      {error ? <Callout tone="error">{error}</Callout> : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <Card padding="none">
          <div className="border-b border-line-2 px-5 py-4">
            <Heading as="h2" size="sm">Agent tokens</Heading>
            <p className="mt-1 text-xs text-ink-2">
              Secrets are hashed and shown only when created.
            </p>
          </div>
          {loading ? (
            <p className="px-5 py-8 text-center text-sm text-ink-2">Loading tokens…</p>
          ) : (
            <TokenList onRevoke={revoke} revoking={revoking} tokens={tokens} />
          )}
        </Card>
        <Card>
          <Heading as="h2" className="mb-4" size="sm">New token</Heading>
          <TokenCreateForm busy={creating} error={creating ? error : undefined} onCreate={create} />
        </Card>
      </div>
    </div>
  );
}
