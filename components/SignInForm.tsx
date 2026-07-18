"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { signIn, type AuthSession, type PasswordChallenge } from "@/lib/auth/cognito";

type SignInFormProps = {
  onAuthenticated: (session: AuthSession) => void;
  onForgotPassword: () => void;
  onNewPasswordRequired: (challenge: PasswordChallenge) => void;
};

export function SignInForm({
  onAuthenticated,
  onForgotPassword,
  onNewPasswordRequired,
}: SignInFormProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const data = new FormData(event.currentTarget);

    try {
      const result = await signIn(String(data.get("email")), String(data.get("password")));
      if (result.kind === "new-password-required") {
        onNewPasswordRequired(result.challenge);
      } else {
        onAuthenticated(result.session);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed. Check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input aria-describedby={error ? "sign-in-error" : undefined} autoComplete="username" id="email" invalid={Boolean(error)} name="email" placeholder="you@example.com" required type="email" />
      </div>
      <div className="mb-[22px]">
        <Label htmlFor="password">Password</Label>
        <Input aria-describedby={error ? "sign-in-error" : undefined} autoComplete="current-password" id="password" invalid={Boolean(error)} name="password" required type="password" />
      </div>
      {error ? <FieldMessage className="mb-4" id="sign-in-error" role="alert" tone="error">{error}</FieldMessage> : null}
      <Button disabled={isSubmitting} fullWidth size="lg" type="submit">{isSubmitting ? "Signing in…" : "Sign in"}</Button>
      <Button className="mx-auto mt-2 flex" onClick={onForgotPassword} size="sm" variant="link">
        Forgot password?
      </Button>
    </form>
  );
}
