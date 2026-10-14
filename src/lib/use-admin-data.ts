// Loads real, aggregated cross-partner data for the /admin dashboard.
// Only returns data if the signed-in user has `is_admin = true` on their
// profile row (enforced both here and by Supabase RLS "Admins can view all…"
// policies — see supabase/schema.sql).

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { trainingModules } from "@/lib/uw-data";

export type PartnerStatus = "on-track" | "at-risk" | "completed" | "new";

export type AdminPartner = {
  id: string;
  name: string;
  email: string;
  path: "Fast-Track" | "Standard";
  joinedDaysAgo: number;
  modulesDone: number;
  aiSessions: number;
  practiceMins: number;
  lastActive: string;
  status: PartnerStatus;
};

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}

function relativeTime(date: Date | null, now: Date): string {
  if (!date) return "Never";
  const mins = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/**
 * Lightweight check for whether the signed-in user is an admin, without
 * loading the full cross-partner dataset. Used to conditionally show an
 * "Admin" nav link in the shared header.
 */
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", uid).maybeSingle();
      if (!cancelled) setIsAdmin(!!me?.is_admin);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return isAdmin;
}

export function useAdminData() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [moduleCompletionStats, setModuleCompletionStats] = useState<{ module: string; rate: number }[]>([]);
  const [weeklySignups, setWeeklySignups] = useState<{ week: string; partners: number }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", uid).maybeSingle();
    if (!me?.is_admin) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setIsAdmin(true);

    const [{ data: profiles }, { data: progress }, { data: sessions }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, experience, created_at"),
      supabase.from("module_progress").select("user_id, module_id, status"),
      supabase.from("practice_sessions").select("user_id, duration_seconds, started_at"),
    ]);

    const now = new Date();
    const progressByUser = new Map<string, { module_id: string; status: string }[]>();
    for (const row of progress ?? []) {
      const list = progressByUser.get(row.user_id) ?? [];
      list.push(row);
      progressByUser.set(row.user_id, list);
    }
    const sessionsByUser = new Map<string, { duration_seconds: number | null; started_at: string }[]>();
    for (const row of sessions ?? []) {
      const list = sessionsByUser.get(row.user_id) ?? [];
      list.push(row);
      sessionsByUser.set(row.user_id, list);
    }

    const rows: AdminPartner[] = (profiles ?? []).map((p) => {
      const myProgress = progressByUser.get(p.id) ?? [];
      const mySessions = sessionsByUser.get(p.id) ?? [];
      const modulesDone = myProgress.filter((m) => m.status === "completed").length;
      const practiceMins = Math.round(mySessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0) / 60);
      const lastSessionAt = mySessions
        .map((s) => new Date(s.started_at))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      const joined = new Date(p.created_at);
      const joinedDaysAgo = daysBetween(joined, now);
      const lastActiveDate = lastSessionAt ?? joined;
      const daysSinceActive = daysBetween(lastActiveDate, now);

      let status: PartnerStatus;
      if (modulesDone >= trainingModules.length) status = "completed";
      else if (joinedDaysAgo <= 2 && modulesDone === 0) status = "new";
      else if (daysSinceActive > 5) status = "at-risk";
      else status = "on-track";

      return {
        id: p.id,
        name: p.full_name?.trim() || p.email?.split("@")[0] || "Partner",
        email: p.email ?? "",
        path: p.experience === "experienced" ? "Fast-Track" : "Standard",
        joinedDaysAgo,
        modulesDone,
        aiSessions: mySessions.length,
        practiceMins,
        lastActive: relativeTime(lastActiveDate, now),
        status,
      };
    });
    setPartners(rows);

    setModuleCompletionStats(
      trainingModules.map((m) => {
        const completedCount = (profiles ?? []).filter((p) =>
          (progressByUser.get(p.id) ?? []).some((pr) => pr.module_id === m.id && pr.status === "completed"),
        ).length;
        const rate = (profiles ?? []).length ? Math.round((completedCount / (profiles ?? []).length) * 100) : 0;
        return { module: `M${m.number}: ${m.shortTitle}`, rate };
      }),
    );

    const weeks: { week: string; partners: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getTime() - i * 7 * 86_400_000);
      const end = new Date(start.getTime() + 7 * 86_400_000);
      const count = (profiles ?? []).filter((p) => {
        const created = new Date(p.created_at);
        return created >= start && created < end;
      }).length;
      weeks.push({ week: `W${6 - i}`, partners: count });
    }
    setWeeklySignups(weeks);

    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { loading, isAdmin, partners, moduleCompletionStats, weeklySignups, refresh: load };
}
