"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthBrand } from "@/components/AuthBrand";
import { SessionProvider } from "@/components/SessionContext";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { NewPasswordForm } from "@/components/NewPasswordForm";
import { SignInForm } from "@/components/SignInForm";
import { LoadingState } from "@/components/LoadingState";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Heading } from "@/components/ui/Heading";
import {
  restoreSession,
  type AuthSession,
  type PasswordChallenge,
} from "@/lib/auth/cognito";

type GateState =
  | { kind: "loading" }
  | { kind: "signed-out"; notice?: string }
  | { kind: "forgot-password" }
  | { kind: "new-password"; challenge: PasswordChallenge }
  | { kind: "authenticated"; session: AuthSession };

export function AuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>({ kind: "loading" });

  useEffect(() => {
    let active = true;
    restoreSession().then((session) => {
      if (active) {
        setState(
          session
            ? { kind: "authenticated", session }
            : { kind: "signed-out" },
        );
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <main className="paper-grid grid min-h-screen place-items-center px-5">
        <LoadingState>Opening your notebook…</LoadingState>
      </main>
    );
  }

  if (state.kind === "authenticated") {
    return (
      <SessionProvider session={state.session}>
        <AppShell>{children}</AppShell>
      </SessionProvider>
    );
  }

  return (
    <main className="paper-grid grid min-h-screen place-items-center px-5 py-8 sm:px-6 sm:py-12">
      <Card
        className="w-full max-w-[360px] rounded-xl px-[26px] py-[30px] sm:px-[34px] sm:py-[38px]"
        elevation="raised"
        padding="none"
      >
        {state.kind === "new-password" ? (
          <NewPasswordForm
            challenge={state.challenge}
            onAuthenticated={(session) =>
              setState({ kind: "authenticated", session })
            }
          />
        ) : (
          <>
            <AuthBrand />
            {state.kind === "forgot-password" ? (
              <>
                <Heading as="h1" className="mb-1.5" size="sm">
                  Reset your password
                </Heading>
                <p className="mb-5 text-xs leading-relaxed text-ink-2">
                  We&apos;ll send a confirmation code to your verified email.
                </p>
                <ForgotPasswordForm
                  onCancel={() => setState({ kind: "signed-out" })}
                  onComplete={() =>
                    setState({
                      kind: "signed-out",
                      notice: "Password reset. Sign in with your new password.",
                    })
                  }
                />
              </>
            ) : (
              <>
                <h1 className="sr-only">Sign in</h1>
                {state.notice ? (
                  <Callout className="mb-5" tone="success">
                    {state.notice}
                  </Callout>
                ) : null}
                <SignInForm
                  onAuthenticated={(session) =>
                    setState({ kind: "authenticated", session })
                  }
                  onForgotPassword={() =>
                    setState({ kind: "forgot-password" })
                  }
                  onNewPasswordRequired={(challenge) =>
                    setState({ kind: "new-password", challenge })
                  }
                />
                <Divider className="mt-5 mb-[18px]" />
                <p className="text-center text-[11px] leading-5 text-ink-3">
                  Accounts are provisioned by the owner.
                  <br />
                  There is no public sign-up.
                </p>
              </>
            )}
          </>
        )}
      </Card>
    </main>
  );
}
