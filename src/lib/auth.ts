// Lightweight client-side mock auth.
// TODO: Replace with real session/auth (Supabase, etc.) when a backend exists.
// There is no server to verify credentials against yet, so this just tracks
// "is there a signed-in partner on this device" via localStorage, and is
// only ever read/written in the browser.

const AUTH_KEY = "uw-auth-session";

export type AuthSession = {
  email: string;
  name?: string;
  signedInAt: string;
};

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AUTH_KEY) !== null;
  } catch {
    return false;
  }
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function login(email: string, name?: string): void {
  if (typeof window === "undefined") return;
  const session: AuthSession = { email, name, signedInAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

/** Best-effort display name: explicit name, or derived from the email's local part. */
export function getDisplayName(session: AuthSession | null): string {
  if (!session) return "Partner";
  if (session.name?.trim()) return session.name.trim();
  const local = session.email.split("@")[0] ?? "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "Partner";
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/** Up to 2-letter initials for an avatar, derived from a display name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function logout(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}
