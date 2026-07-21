"use client";

import { Button } from "@/components/ui/Button";
import { clearSession } from "@/lib/auth/cognito";

export function SignOutButton() {
  return (
    <Button
      onClick={() => {
        clearSession();
        window.location.assign("/");
      }}
      variant="secondary"
    >
      Sign out
    </Button>
  );
}
