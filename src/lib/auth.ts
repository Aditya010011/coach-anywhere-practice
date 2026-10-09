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

export function logout(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}
