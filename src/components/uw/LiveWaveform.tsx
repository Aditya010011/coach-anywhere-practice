import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type VizMode = "bars" | "circle" | "frequency";
export type VoiceState = "idle" | "user" | "ai";

const COLORS: Record<VoiceState, [string, string]> = {
  idle: ["#7c3aed", "#3b82f6"],
  user: ["#22c55e", "#4ade80"],
  ai: ["#f97316", "#ef4444"],
};

const BAR_COUNT = 40;

export function LiveWaveform({
  analyser,
  mode = "bars",
  state = "idle",
  sensitivity = 1,
  level,
  className,
}: {
  analyser: AnalyserNode | null;
  mode?: VizMode;
  state?: VoiceState;
  sensitivity?: number;
  /**
   * Optional 0-1 volume level used to drive the animation when no
   * AnalyserNode is available (e.g. remote/Vapi audio we don't have a
   * local stream for). Ignored when `analyser` is provided.
   */
  level?: number | undefined;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(mode);
  const stateRef = useRef(state);
  const sensRef = useRef(sensitivity);
  const levelRef = useRef(level);
  modeRef.current = mode;
  stateRef.current = state;
  sensRef.current = sensitivity;
  levelRef.current = level;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t = 0;
    const data = new Uint8Array(analyser ? analyser.frequencyBinCount : BAR_COUNT * 2);

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (analyser) analyser.getByteFrequencyData(data);
      t += reduced ? 0 : 0.05;

      const amp = (i: number) => {
        const raw = analyser
          ? (data[Math.floor((i / BAR_COUNT) * (data.length * 0.6))] ?? 0) / 255
          : (Math.sin(t + i * 0.4) * 0.5 + 0.5) * 0.55 * (levelRef.current ?? 1);
        return Math.min(1, Math.max(0.06, raw * sensRef.current));
      };

      const [c1, c2] = COLORS[stateRef.current];
      const grad = ctx.createLinearGradient(0, h, w, 0);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      ctx.strokeStyle = grad;

      const m = modeRef.current;
      if (m === "circle") {
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.22;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i <= BAR_COUNT; i++) {
          const a = (i / BAR_COUNT) * Math.PI * 2;
          const rr = r + amp(i % BAR_COUNT) * r * 1.2;
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 0.18;
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (m === "frequency") {
        const bw = w / BAR_COUNT;
        for (let i = 0; i < BAR_COUNT; i++) {
          const bh = amp(i) * h;
          ctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
        }
      } else {
        const bw = w / BAR_COUNT;
        for (let i = 0; i < BAR_COUNT; i++) {
          const bh = Math.max(4, amp(i) * h * 0.9);
          const x = i * bw + bw * 0.2;
          const bwidth = bw * 0.6;
          const y = (h - bh) / 2;
          const r = bwidth / 2;
          ctx.beginPath();
          ctx.roundRect(x, y, bwidth, bh, r);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Live audio visualisation"
      className={cn("w-full", className)}
    />
  );
}
