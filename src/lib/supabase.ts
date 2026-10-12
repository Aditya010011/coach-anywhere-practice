// Supabase browser client.
// Safe to import on the server too (TanStack Start SSR) since the anon key
// is public, but all real data access is gated by Row Level Security (RLS)
// policies defined in supabase/schema.sql — not by this key.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). " +
      "Auth and data features will not work until these are set in .env.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: typeof window !== "undefined",
  },
});
