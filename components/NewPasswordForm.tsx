"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  completeNewPassword,
  type AuthSession,
  type PasswordChallenge,
} from "@/lib/auth/cognito";

type NewPasswordFormProps = {
  challenge: PasswordChallenge;
  onAuthenticated: (session: AuthSession) => void;
};

export function NewPasswordForm({
  challenge,
  onAuthenticated,
}: NewPasswordFormProps) {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const confirmationInvalid = error === "Passwords don't match.";
  const requirements = [
    { label: "At least 12 characters", met: password.length >= 12 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One symbol", met: /[^A-Za-z0-9]/.test(password) },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmation) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      onAuthenticated(await completeNewPassword(challenge, password));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The password could not be changed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h1" className="mb-1.5" size="sm">
        Choose a new password
      </Heading>
      <Callout className="mb-5 text-xs" tone="warning">
        You signed in with a temporary password. Set a permanent one to
        continue.
      </Callout>
      <div className="mb-3.5">
        <Label htmlFor="new-password">New password</Label>
        <Input
          aria-describedby="password-requirements"
          autoComplete="new-password"
          id="new-password"
          minLength={12}
          name="new-password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input
          aria-describedby={
            confirmationInvalid
              ? "confirm-password-error password-requirements"
              : "password-requirements"
          }
          autoComplete="new-password"
          id="confirm-password"
          invalid={confirmationInvalid}
          minLength={12}
          name="confirm-password"
          onChange={(event) => {
            setConfirmation(event.target.value);
            if (confirmationInvalid) setError("");
          }}
          required
          type="password"
          value={confirmation}
        />
      </div>
      {confirmationInvalid ? (
        <FieldMessage id="confirm-password-error" role="alert" tone="error">
          {error}
        </FieldMessage>
      ) : null}
      <div className="my-4 grid gap-1" id="password-requirements">
        {requirements.map((requirement) => (
          <p
            className={`flex items-center gap-2 text-xs ${requirement.met ? "text-success" : "text-ink-3"}`}
            key={requirement.label}
          >
            <StatusDot tone={requirement.met ? "success" : "neutral"} />
            {requirement.label}
          </p>
        ))}
      </div>
      {error && !confirmationInvalid ? (
        <FieldMessage className="mb-4" role="alert" tone="error">
          {error}
        </FieldMessage>
      ) : null}
      <Button disabled={isSubmitting} fullWidth size="lg" type="submit">
        {isSubmitting ? "Saving…" : "Set password & continue"}
      </Button>
    </form>
  );
}
