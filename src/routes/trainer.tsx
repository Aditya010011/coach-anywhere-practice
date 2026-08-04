import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  X,
  Mic,
  MicOff,
  Volume2,
  PartyPopper,
  History,
  Star,
  Download,
  Share2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Waveform } from "@/components/uw/Waveform";
import { scenarios, practiceSessions } from "@/lib/uw-data";

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

const focusAreas = [
  "Overcoming objections",
  "Explaining bundles",
  "Building rapport",
  "Closing confidently",
  "Answering technical questions",
];

const levelStyles = {
  beginner: "border-success text-success data-[state=checked]:bg-success/15",
  intermediate: "border-warning text-warning data-[state=checked]:bg-warning/15",
  advanced: "border-destructive text-destructive data-[state=checked]:bg-destructive/15",
} as const;

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Trainer() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const lastDuration = useRef(0);

  // Pre-session config
  const [scenario, setScenario] = useState("objections");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [goalMinutes, setGoalMinutes] = useState([15]);
  const [focus, setFocus] = useState<string[]>([]);

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

  function toggleFocus(area: string) {
    setFocus((f) => {
      if (f.includes(area)) return f.filter((a) => a !== area);
      if (f.length >= 3) return f;
      return [...f, area];
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-night text-primary-foreground">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-4 sm:px-6">
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
          size="sm"
          className="min-h-11 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          onClick={() => setHistoryOpen(true)}
        >
          <History />
          <span className="hidden sm:inline">View history</span>
        </Button>
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
          <div className="flex flex-1 flex-col items-center py-6 text-center">
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

            {/* Pre-session configuration */}
            <div className="mt-8 w-full rounded-2xl bg-card/50 p-6 text-left text-foreground backdrop-blur">
              <h2 className="text-sm font-semibold">Session setup</h2>

              <div className="mt-4 space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Scenario</label>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger aria-label="Practice scenario" className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className="mr-1">{s.icon}</span>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-5 space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Challenge level</label>
                <RadioGroup
                  value={level}
                  onValueChange={(v) => setLevel(v as typeof level)}
                  className="grid grid-cols-3 gap-2"
                >
                  {(
                    [
                      ["beginner", "Beginner"],
                      ["intermediate", "Intermediate"],
                      ["advanced", "Advanced"],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors ${levelStyles[value]} ${level === value ? "" : "bg-transparent"}`}
                      style={level === value ? undefined : { backgroundColor: "transparent" }}
                      data-state={level === value ? "checked" : "unchecked"}
                    >
                      <RadioGroupItem value={value} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Practice goal</label>
                  <span className="text-xs font-semibold">{goalMinutes[0]} min</span>
                </div>
                <Slider
                  value={goalMinutes}
                  onValueChange={setGoalMinutes}
                  min={5}
                  max={30}
                  step={5}
                  aria-label="Practice goal minutes"
                />
              </div>

              <div className="mt-5 space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  What to practice (up to 3)
                </label>
                <div className="space-y-2">
                  {focusAreas.map((area) => {
                    const checked = focus.includes(area);
                    const disabled = !checked && focus.length >= 3;
                    return (
                      <label
                        key={area}
                        className={`flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 ${disabled ? "opacity-50" : "cursor-pointer hover:bg-accent"}`}
                      >
                        <Checkbox
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={() => toggleFocus(area)}
                        />
                        <span className="text-sm">{area}</span>
                      </label>
                    );
                  })}
                </div>
                {focus.length >= 3 && (
                  <p className="text-xs text-muted-foreground">Maximum of 3 focus areas selected.</p>
                )}
              </div>

              <Button
                onClick={() => setActive(true)}
                disabled={focus.length === 0}
                className={`mt-6 min-h-12 w-full rounded-xl text-base ${focus.length > 0 ? "relative animate-pulse-ring" : ""}`}
              >
                Start practice session
              </Button>
            </div>
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
        {active && (
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
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger
                  aria-label="Practice scenario"
                  className="min-h-11 border-primary-foreground/25 bg-transparent text-primary-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
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

      <HistorySheet open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  );
}

function HistorySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [filter, setFilter] = useState<"7" | "30" | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = practiceSessions.filter((s) => {
    if (filter === "7") return s.daysAgo <= 7;
    if (filter === "30") return s.daysAgo <= 30;
    return true;
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col text-foreground sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Practice History</SheetTitle>
        </SheetHeader>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="w-full">
            <TabsTrigger value="7" className="flex-1">
              Last 7 days
            </TabsTrigger>
            <TabsTrigger value="30" className="flex-1">
              Last 30 days
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1">
              All time
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 space-y-3 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No sessions yet. Start your first practice!
            </p>
          )}
          {filtered.map((s) => {
            const isOpen = expanded === s.id;
            return (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{s.date}</p>
                    <p className="text-xs text-muted-foreground">{s.duration}</p>
                  </div>
                  <span className="text-xl" aria-hidden="true">
                    {s.icon}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{s.scenario}</p>
                <div className="mt-1 flex items-center gap-0.5" aria-label={`${s.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < s.rating ? "fill-gold text-gold" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.topics.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 min-h-9 w-full rounded-xl"
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                >
                  {isOpen ? "Collapse" : "Review transcript"}
                  <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>

                {isOpen && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    {s.transcript.map((m, i) => (
                      <div
                        key={i}
                        className={
                          m.who === "you"
                            ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-muted px-3 py-2 text-right"
                            : "max-w-[88%] rounded-2xl rounded-bl-sm bg-gradient-brand px-3 py-2 text-primary-foreground"
                        }
                      >
                        <p
                          className={`text-[10px] font-semibold uppercase tracking-wide ${m.who === "you" ? "text-muted-foreground" : "text-primary-foreground/70"}`}
                        >
                          {m.who === "you" ? "You" : "AI Coach"} · {m.at}
                        </p>
                        <p
                          className={
                            m.tone === "good"
                              ? "mt-0.5 rounded-md bg-success/20 px-1.5 py-0.5 text-sm text-success-foreground"
                              : m.tone === "improve"
                                ? "mt-0.5 rounded-md bg-warning/25 px-1.5 py-0.5 text-sm"
                                : "mt-0.5 text-sm"
                          }
                        >
                          {m.text}
                        </p>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="min-h-9 flex-1 rounded-xl"
                        onClick={() => toast.success("Download ready!")}
                      >
                        <Download className="size-4" />
                        Download .txt
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="min-h-9 flex-1 rounded-xl"
                        onClick={() => toast("Shared with mentor")}
                      >
                        <Share2 className="size-4" />
                        Share with mentor
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
