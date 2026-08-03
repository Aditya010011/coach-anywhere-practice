import { cn } from "@/lib/utils";

const HEIGHTS = [40, 68, 96, 56, 120, 72, 44, 88, 60, 104, 48, 76, 36, 92, 52];

export function Waveform({
  className,
  active = true,
  bars = HEIGHTS,
}: {
  className?: string;
  active?: boolean;
  bars?: number[];
}) {
  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)} aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-1.5 rounded-full bg-gradient-warm",
            active ? "animate-wave" : "opacity-40",
          )}
          style={{
            height: `${h}px`,
            animationDelay: `${(i % 7) * 0.11}s`,
            animationDuration: `${0.9 + (i % 4) * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}
