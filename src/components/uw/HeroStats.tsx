import { useEffect, useState } from "react";
import { Users, Mic, Star } from "lucide-react";

import { useCountUp } from "@/hooks/use-count-up";

function usesReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function PartnersStat() {
  const base = useCountUp(5247, 2000, 5000);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (usesReducedMotion()) return;
    const id = setInterval(() => setExtra((e) => e + 1), 10_000);
    return () => clearInterval(id);
  }, []);

  const value = Math.round(base) + extra;
  return (
    <StatBox icon={Users} value={value.toLocaleString()} label="Partners trained" />
  );
}

function SessionsStat() {
  const base = useCountUp(28931, 2000, 28000);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (usesReducedMotion()) return;
    const id = setInterval(
      () => setExtra((e) => e + (2 + Math.round(Math.random()))),
      5_000,
    );
    return () => clearInterval(id);
  }, []);

  const value = Math.round(base) + extra;
  return (
    <StatBox icon={Mic} value={value.toLocaleString()} label="Practice sessions" />
  );
}

function RatingStat() {
  const value = useCountUp(4.8, 2000, 4.5);
  return <StatBox icon={Star} value={value.toFixed(1)} label="Average rating" />;
}

function StatBox({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p
          aria-live="off"
          className="font-mono text-lg leading-tight font-bold tabular-nums text-foreground"
        >
          {value}
        </p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function HeroStats() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <PartnersStat />
      <SessionsStat />
      <RatingStat />
    </div>
  );
}
