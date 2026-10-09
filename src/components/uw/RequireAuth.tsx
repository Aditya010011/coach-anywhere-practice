import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { isAuthenticated } from "@/lib/auth";

/**
 * Client-side route guard for pages that require a signed-in partner.
 *
 * There's no backend session to check during SSR, so auth is verified once
 * the page hydrates in the browser (via localStorage). Unauthenticated
 * visitors are redirected to /login; a brief loading state avoids flashing
 * protected content before the check completes.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
      return;
    }
    setChecked(true);
  }, [navigate]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return <>{children}</>;
}
