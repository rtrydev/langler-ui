"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  confirmPasswordReset,
  requestPasswordReset,
} from "@/lib/auth/cognito";

type ForgotPasswordFormProps = {
  onCancel: () => void;
  onComplete: () => void;
};

export function ForgotPasswordForm({
  onCancel,
  onComplete,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"request" | "confirm">("request");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const data = new FormData(event.currentTarget);

    try {
      if (step === "request") {
        await requestPasswordReset(email);
        setStep("confirm");
      } else {
        const password = String(data.get("new-password"));
        if (password !== String(data.get("confirm-password"))) {
          setError("The passwords do not match.");
          return;
        }
        await confirmPasswordReset(
          email,
          String(data.get("confirmation-code")),
          password,
        );
        onComplete();
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Your password could not be reset.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {step === "confirm" ? (
        <Callout tone="info">
          Enter the confirmation code sent to {email}.
        </Callout>
      ) : null}
      {step === "request" ? (
        <div>
          <Label htmlFor="reset-email">Email</Label>
          <Input
            autoComplete="username"
            id="reset-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
      ) : (
        <>
          <div>
            <Label htmlFor="confirmation-code">Confirmation code</Label>
            <Input
              autoComplete="one-time-code"
              id="confirmation-code"
              inputMode="numeric"
              name="confirmation-code"
              required
            />
          </div>
          <div>
            <Label htmlFor="reset-password">New password</Label>
            <Input
              autoComplete="new-password"
              id="reset-password"
              minLength={12}
              name="new-password"
              required
              type="password"
            />
          </div>
          <div>
            <Label htmlFor="reset-confirm-password">Confirm password</Label>
            <Input
              autoComplete="new-password"
              id="reset-confirm-password"
              invalid={error === "The passwords do not match."}
              minLength={12}
              name="confirm-password"
              required
              type="password"
            />
          </div>
        </>
      )}
      {error ? (
        <FieldMessage role="alert" tone="error">
          {error}
        </FieldMessage>
      ) : null}
      <Button disabled={isSubmitting} fullWidth size="lg" type="submit">
        {isSubmitting
          ? "Please wait…"
          : step === "request"
            ? "Send reset code"
            : "Reset password"}
      </Button>
      <Button className="mx-auto" onClick={onCancel} size="sm" variant="link">
        Back to sign in
      </Button>
    </form>
  );
}
