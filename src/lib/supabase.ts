// Supabase browser client.
// Safe to import on the server too (TanStack Start SSR) since the anon key
// is public, but all real data access is gated by Row Level Security (RLS)
// policies defined in supabase/schema.sql — not by this key.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Auth and data features will not work until these are set (e.g. in .env locally, " +
      "or as Vercel project environment variables in production).",
  );
}

// createClient() throws if given an empty/invalid URL, which would crash the
// entire app (including SSR) if the env vars aren't set. Fall back to a
// syntactically valid placeholder so the client can still be constructed —
// `isSupabaseConfigured` should be checked before relying on real data.
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-anon-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: typeof window !== "undefined",
  },
});
