import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

export type VapiTranscriptMessage = {
  who: "ai" | "you";
  text: string;
};

export type VapiCallStatus = "idle" | "connecting" | "active" | "ended" | "error";

export type VapiPartialTranscript = {
  who: "ai" | "you";
  text: string;
} | null;

type VapiMessageEvent = {
  type: string;
  role?: "user" | "assistant" | "system";
  transcriptType?: "partial" | "final";
  transcript?: string;
};

/**
 * Thin wrapper around the Vapi Web SDK that exposes call lifecycle state
 * and final transcript turns in a shape the trainer UI already expects.
 *
 * Requires VITE_VAPI_PUBLIC_KEY and VITE_VAPI_ASSISTANT_ID env vars.
 */
export function useVapi() {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<VapiCallStatus>("idle");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState<VapiTranscriptMessage[]>([]);
  const [partial, setPartial] = useState<VapiPartialTranscript>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      setError("Missing VITE_VAPI_PUBLIC_KEY");
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    const onCallStart = () => {
      setStatus("active");
      setError(null);
    };
    const onCallEnd = () => setStatus("ended");
    const onSpeechStart = () => setAiSpeaking(true);
    const onSpeechEnd = () => setAiSpeaking(false);
    const onVolumeLevel = (level: number) => setVolumeLevel(level);
    const onMessage = (message: VapiMessageEvent) => {
      if (message.type !== "transcript" || !message.transcript) return;
      const who = message.role === "user" ? "you" : "ai";
      if (message.transcriptType === "final") {
        setPartial(null);
        setTranscript((prev) => [...prev, { who, text: message.transcript! }]);
      } else if (message.transcriptType === "partial") {
        setPartial({ who, text: message.transcript });
      }
    };
    const onError = (err: unknown) => {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Vapi call error");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("volume-level", onVolumeLevel);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.stop();
      vapiRef.current = null;
    };
  }, []);

  const start = useCallback(async () => {
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
    if (!vapiRef.current || !assistantId) {
      setError("Missing VITE_VAPI_ASSISTANT_ID");
      setStatus("error");
      return;
    }
    setStatus("connecting");
    setTranscript([]);
    setPartial(null);
    try {
      await vapiRef.current.start(assistantId);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to start call");
    }
  }, []);

  const stop = useCallback(() => {
    vapiRef.current?.stop();
    setStatus("ended");
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    vapiRef.current?.setMuted(muted);
  }, []);

  const isConfigured = Boolean(
    import.meta.env.VITE_VAPI_PUBLIC_KEY && import.meta.env.VITE_VAPI_ASSISTANT_ID,
  );

  return {
    status,
    aiSpeaking,
    volumeLevel,
    transcript,
    partial,
    error,
    start,
    stop,
    setMuted,
    isConfigured,
  };
}
