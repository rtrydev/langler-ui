"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AuthSession } from "@/lib/auth/cognito";

const SessionContext = createContext<AuthSession | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: AuthSession;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): AuthSession {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession must be used inside the authenticated shell");
  }
  return session;
}
