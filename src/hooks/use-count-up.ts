import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function usesReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animates a number from `start` to `target` over `durationMs`, using
 * requestAnimationFrame and an ease-out curve. Respects prefers-reduced-motion
 * (jumps straight to the target value).
 */
export function useCountUp(target: number, durationMs = 2000, start = 0) {
  const [value, setValue] = useState(usesReducedMotion() ? target : start);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (usesReducedMotion()) {
      setValue(target);
      return;
    }
    let startTime: number | null = null;
    const from = start;
    const to = target;

    function tick(ts: number) {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      setValue(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}
