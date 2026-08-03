import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, X, Mic, MicOff, Volume2, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Waveform } from "@/components/uw/Waveform";

export const Route = createFileRoute("/trainer")({
  head: () => ({
    meta: [
      { title: "Voice AI Trainer — Practise UW Conversations" },
      {
        name: "description",
        content:
          "Tap, speak and practise real UW customer conversations with your voice AI coach. Objections, product Q&A, first call and closing scenarios.",
      },
      { property: "og:title", content: "Voice AI Trainer — Practise UW Conversations" },
      {
        property: "og:description",
        content: "Your 24/7 voice AI coach for objection handling and customer conversations.",
      },
    ],
  }),
  component: Trainer,
});

const transcript = [
  { who: "ai", text: "Hi Sarah! Let's practise objections. I'm a busy neighbour — go ahead." },
  { who: "you", text: "Hi Jane! Quick question — who do you pay for broadband at the moment?" },
  { who: "ai", text: "Honestly I'm quite busy right now, and I think switching is a hassle." },
  { who: "you", text: "Totally fair. It takes about ten minutes and I handle the rest for you." },
];

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Trainer() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const lastDuration = useRef(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  function endSession() {
    lastDuration.current = seconds;
    setActive(false);
    setSeconds(0);
    setSummaryOpen(true);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-night text-primary-foreground">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="min-h-11 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <Link to="/dashboard">
            <ArrowLeft />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </Button>
        <p className="text-center font-mono text-sm text-primary-foreground/80" aria-live="off">
          {formatTime(seconds)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          aria-label="End session"
          onClick={endSession}
          disabled={!active}
          className="min-h-11 min-w-11 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <X />
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 pb-6 sm:px-6">
        {!active ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <button
              type="button"
              onClick={() => setActive(true)}
              aria-label="Start practice session"
              className="relative grid size-40 place-items-center rounded-full bg-gradient-brand shadow-lift transition-transform duration-100 active:scale-[0.98] sm:size-48"
            >
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/40" />
              <Mic className="relative size-14 text-primary-foreground" aria-hidden="true" />
            </button>
            <p className="mt-8 text-lg font-semibold">Tap to start practice session</p>
            <p className="mt-2 max-w-sm text-sm text-primary-foreground/70">
              No question is too small. Your coach is ready whenever you are.
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col">
            <Waveform className="my-10 h-28 sm:h-36" />
            <div
              className="flex-1 space-y-3 overflow-y-auto"
              aria-live="polite"
              aria-label="Live transcript"
            >
              {transcript.map((m, i) =>
                m.who === "you" ? (
                  <p
                    key={i}
                    className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary-foreground/12 px-4 py-3 text-sm"
                  >
                    {m.text}
                  </p>
                ) : (
                  <p
                    key={i}
                    className="max-w-[88%] rounded-2xl rounded-bl-sm bg-gradient-brand px-4 py-3 text-sm shadow-lift"
                  >
                    {m.text}
                  </p>
                ),
              )}
            </div>
          </div>
        )}

        {/* Bottom toolbar */}
        <div className="mt-8 w-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 p-4 backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
            <Button
              variant="ghost"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={muted}
              className="min-h-11 justify-start text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              {muted ? <MicOff /> : <Mic />}
              {muted ? "Unmute" : "Mute"}
            </Button>
            <div className="flex min-w-0 items-center gap-3">
              <Volume2 className="size-4 shrink-0 text-primary-foreground/70" aria-hidden="true" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={5}
                aria-label="AI voice volume"
                className="min-w-0 flex-1"
              />
            </div>
            <Select defaultValue="objections">
              <SelectTrigger
                aria-label="Practice scenario"
                className="min-h-11 border-primary-foreground/25 bg-transparent text-primary-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="objections">Customer objections</SelectItem>
                <SelectItem value="product">Product Q&amp;A</SelectItem>
                <SelectItem value="first-call">First call</SelectItem>
                <SelectItem value="closing">Closing techniques</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </main>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <PartyPopper className="size-5 text-gold" aria-hidden="true" />
              Session complete
            </DialogTitle>
          </DialogHeader>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="font-semibold">{formatTime(lastDuration.current)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Topics covered</dt>
              <dd className="text-right font-semibold">Bundle savings, objection handling</dd>
            </div>
          </dl>
          <p className="rounded-xl bg-accent p-4 text-sm leading-relaxed text-accent-foreground">
            You handled the “too expensive” objection well. Next time, pause a little longer between
            points so your prospect can respond.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="min-h-11 flex-1 rounded-xl"
              onClick={() => {
                setSummaryOpen(false);
                setActive(true);
              }}
            >
              Practise again
            </Button>
            <Button asChild variant="outline" className="min-h-11 flex-1 rounded-xl">
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
