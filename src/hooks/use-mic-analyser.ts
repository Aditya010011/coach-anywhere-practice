import { useCallback, useEffect, useRef, useState } from "react";

// TODO(vapi): when the Vapi SDK lands, feed its output stream into the same
// AnalyserNode so the visualiser reacts to the real AI voice as well.

export type MicStatus = "idle" | "requesting" | "ready" | "denied";

export function useMicAnalyser() {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [level, setLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    analyserRef.current = null;
    setLevel(0);
    setStatus("idle");
  }, []);

  const request = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("denied");
      return false;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx: typeof AudioContext =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);

      streamRef.current = stream;
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      setStatus("ready");

      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        const a = analyserRef.current;
        if (a) {
          a.getByteFrequencyData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = buf[i] ?? 0;
            sum += v * v;
          }
          setLevel(Math.min(1, Math.sqrt(sum / buf.length) / 90));
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return true;
    } catch {
      setStatus("denied");
      return false;
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { status, level, analyserRef, request, stop };
}
