"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import type { AgentTokenInput } from "@/lib/validation/agent-token";

type TokenCreateFormProps = {
  busy: boolean;
  error?: string;
  onCreate: (input: AgentTokenInput) => void;
};

export function TokenCreateForm({
  busy,
  error,
  onCreate,
}: TokenCreateFormProps) {
  const [label, setLabel] = useState("");
  const [scopes, setScopes] = useState<AgentTokenInput["scopes"]>([
    "read-reference",
    "import-lessons",
  ]);
  const [expiryDays, setExpiryDays] = useState<30 | 90 | 365>(90);

  function toggleScope(scope: AgentTokenInput["scopes"][number]) {
    setScopes((current) =>
      current.includes(scope)
        ? current.filter((item) => item !== scope)
        : [...current, scope],
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate({ label, scopes, expiryDays });
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <div>
        <Label htmlFor="token-label">Label</Label>
        <Input
          autoComplete="off"
          id="token-label"
          maxLength={80}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Claude Code — laptop"
          value={label}
        />
      </div>
      <fieldset>
        <legend className="mb-1.5 block text-[13px] font-[540] text-ink">
          Scopes
        </legend>
        <div className="flex flex-wrap gap-2">
          <ChoiceChip
            checked={scopes.includes("read-reference")}
            onChange={() => toggleScope("read-reference")}
            type="checkbox"
          >
            Read reference
          </ChoiceChip>
          <ChoiceChip
            checked={scopes.includes("import-lessons")}
            onChange={() => toggleScope("import-lessons")}
            type="checkbox"
          >
            Import lessons
          </ChoiceChip>
        </div>
      </fieldset>
      <div>
        <Label htmlFor="token-expiry">Expires</Label>
        <Select
          className="w-full"
          id="token-expiry"
          onChange={(event) =>
            setExpiryDays(Number(event.target.value) as 30 | 90 | 365)
          }
          value={expiryDays}
        >
          <option value={30}>In 30 days</option>
          <option value={90}>In 90 days</option>
          <option value={365}>In 1 year</option>
        </Select>
      </div>
      {error ? <FieldMessage tone="error">{error}</FieldMessage> : null}
      <Button disabled={busy} type="submit">
        {busy ? "Creating…" : "Create token"}
      </Button>
    </form>
  );
}
