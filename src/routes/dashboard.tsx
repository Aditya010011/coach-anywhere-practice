import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Mic,
  Lock,
  Check,
  PiggyBank,
  Handshake,
  FileDown,
  CalendarClock,
  ClipboardList,
  Clock,
  Target,
  Play,
  ChevronDown,
  Share2,
  BarChart3,
  BookOpen,
  Phone,
  User,
  MessageCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { UwLogo } from "@/components/uw/SiteHeader";
import { OnboardingTour, useOnboardingTour } from "@/components/uw/OnboardingTour";
import { recentActivity, badges } from "@/lib/uw-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Training Dashboard — UW Partner Coach" },
      {
        name: "description",
        content:
          "Track module progress, milestones and voice AI practice sessions on your UW Partner onboarding dashboard.",
      },
      { property: "og:title", content: "Your Training Dashboard — UW Partner Coach" },
      {
        property: "og:description",
        content: "Modules, milestones and 24/7 voice AI practice, all in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const PROGRESS = 50;

// TODO: Replace with Supabase query — number of completed AI sessions
const AI_SESSIONS_COUNT: number = 7;

const stats = [
  { icon: Check, label: "Modules completed", value: "2 / 4" },
  { icon: Mic, label: "AI sessions", value: "7 total" },
  { icon: Clock, label: "Practice time", value: "45 minutes" },
  { icon: Target, label: "Next milestone", value: "Module 3" },
];

const milestones = [
  { day: "Day 1", label: "Signed up & completed Module 1", state: "done" },
  { day: "Day 2", label: "Practised first AI session", state: "done" },
  { day: "Day 3", label: "Complete Module 2", state: "active" },
  { day: "Day 7", label: "Have your first customer conversation", state: "locked" },
  { day: "Day 10", label: "Mentor 1-on-1 unlocks", state: "locked" },
  { day: "Day 14", label: "Advanced modules available", state: "locked" },
] as const;

const resources = [
  { icon: FileDown, label: "Bill Savings Calculator", meta: "Download" },
  { icon: FileDown, label: "Social Media Templates", meta: "Download" },
  { icon: CalendarClock, label: "Book a Mentor Call", meta: "Unlocks after Module 4" },
  { icon: ClipboardList, label: "Compliance Guidelines", meta: "View" },
];

const quickActions = [
  { key: "stats", icon: BarChart3, label: "View detailed stats" },
  { key: "resources", icon: BookOpen, label: "Browse resources" },
  { key: "mentor", icon: Phone, label: "Book mentor call", locked: true, unlocks: "Unlocks Day 10" },
  { key: "profile", icon: User, label: "Update profile" },
  { key: "support", icon: MessageCircle, label: "Get support" },
  { key: "report", icon: Download, label: "Download progress report" },
] as const;

function Dashboard() {
  const progressRingRef = useRef<HTMLDivElement>(null);
  const nextModuleRef = useRef<HTMLDivElement>(null);
  const aiCardRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLDivElement>(null);

  const { enabled: tourEnabled, dismiss } = useOnboardingTour();
  const [selectedBadge, setSelectedBadge] = useState<(typeof badges)[number] | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([
    "Hi Sarah! I'm your support assistant — how can I help today?",
  ]);

  const tourSteps = [
    { title: "Your progress", description: "This shows your overall training progress", ref: progressRingRef },
    { title: "Keep going", description: "Start here to continue your training", ref: nextModuleRef },
    { title: "Your AI coach", description: "Practice anytime with your AI coach — no judgment, unlimited retries", ref: aiCardRef },
    { title: "Milestones", description: "Track your journey day by day", ref: milestonesRef },
    { title: "Let's go!", description: "Ready to begin? Let's start Module 3!", ref: continueBtnRef },
  ];

  function sendChat() {
    if (!chatMessage.trim()) return;
    setChatLog((log) => [...log, `You: ${chatMessage}`, "Support: Thanks — a mentor will follow up shortly!"]);
    setChatMessage("");
  }

  return (
    <div className="min-h-dvh bg-secondary/40 pb-24 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
          <Link to="/dashboard" aria-label="Dashboard home" className="min-w-0">
            <UwLogo />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications" className="min-h-11 min-w-11">
              <Bell />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="min-h-11 gap-2 px-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                      SM
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">Sarah</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:py-10">
        {/* Left: progress */}
        <section aria-labelledby="progress-heading" className="space-y-5 lg:col-span-4 lg:order-1">
          {/* Achievement badges */}
          <div>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Achievements
            </h2>
            <TooltipProvider delayDuration={200}>
              <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
                {badges.map((b) => {
                  const earned = Boolean(b.earned);
                  const card = (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setSelectedBadge(b)}
                      className={
                        earned
                          ? "flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-card transition-transform duration-150 hover:-translate-y-0.5"
                          : "flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-muted/40 p-3 opacity-60 grayscale transition-transform duration-150 hover:-translate-y-0.5"
                      }
                      aria-label={`${b.title}${earned ? "" : " (locked)"}`}
                    >
                      <span className="relative text-3xl">
                        {b.emoji}
                        {!earned && (
                          <Lock className="absolute -right-1 -bottom-1 size-3.5 rounded-full bg-background p-0.5 text-locked" />
                        )}
                      </span>
                      <span className="truncate text-center text-xs font-medium">{b.title}</span>
                    </button>
                  );
                  return earned ? (
                    card
                  ) : (
                    <Tooltip key={b.id}>
                      <TooltipTrigger asChild>{card}</TooltipTrigger>
                      <TooltipContent>How to unlock: {b.how}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          <div ref={progressRingRef} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h1 id="progress-heading" className="text-xl font-bold tracking-tight">
              Welcome back, Sarah 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You're on the Fast-Track path. Nice pace.
            </p>

            <div className="mt-6 flex justify-center">
              <ProgressRing value={PROGRESS} />
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              2 of 4 modules complete
            </p>

            <dl className="mt-6 space-y-3">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <dt className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{label}</dt>
                  <dd className="shrink-0 text-sm font-semibold">{value}</dd>
                </div>
              ))}
            </dl>

            <div ref={continueBtnRef}>
              <Button asChild className="mt-6 min-h-12 w-full rounded-xl text-base">
                <Link to="/trainer">Continue training</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Middle: what's next */}
        <section aria-labelledby="next-heading" className="space-y-5 lg:col-span-5 lg:order-2">
          <h2 id="next-heading" className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            What's next
          </h2>

          <article ref={nextModuleRef} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground">
                <PiggyBank className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <Badge className="rounded-full border-0 bg-success/15 text-success hover:bg-success/15">
                  <Check className="size-3" aria-hidden="true" />
                  Unlocked
                </Badge>
                <h3 className="mt-2 text-lg font-semibold">Module 3: Bill Savings & Social Proof</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Learn how to show real customer savings and overcome price objections.
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Play className="size-3.5" aria-hidden="true" /> 15 min video
                  </span>
                  <span className="flex items-center gap-1">
                    <Mic className="size-3.5" aria-hidden="true" /> 5 min practice
                  </span>
                </p>
                <Button asChild className="mt-5 min-h-11 rounded-xl">
                  <Link to="/trainer">Start module</Link>
                </Button>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-muted/50 p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted text-locked">
                <Handshake className="size-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <Badge variant="secondary" className="rounded-full text-muted-foreground">
                  <Lock className="size-3" aria-hidden="true" />
                  Locked
                </Badge>
                <h3 className="mt-2 text-lg font-semibold text-muted-foreground">
                  Module 4: Your First Customer
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Complete Module 3 to unlock this step-by-step customer conversation guide.
                </p>
                <Button disabled className="mt-5 min-h-11 rounded-xl">
                  Complete Module 3
                </Button>
              </div>
            </div>
          </article>

          <article ref={aiCardRef} className="relative overflow-hidden rounded-2xl bg-gradient-night p-6 shadow-card">
            {AI_SESSIONS_COUNT === 0 ? (
              <div className="flex flex-col items-center py-4 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-brand/20 text-primary-foreground">
                  <Mic className="size-7" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-primary-foreground">
                  Start your first practice session
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-primary-foreground/75">
                  It only takes 5 minutes to build confidence
                </p>
                <Button asChild className="mt-5 min-h-11 rounded-xl">
                  <Link to="/trainer">Practice now</Link>
                </Button>
              </div>
            ) : (
              <>
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/12 text-primary-foreground">
                  <Mic className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-primary-foreground">
                  Practise with your AI coach
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
                  Feeling stuck? Ask your coach anything about UW services, objections or openers.
                </p>
                <p className="mt-3 font-mono text-xs text-primary-foreground/60">
                  Last session: 2 hours ago · 8 min
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-5 min-h-11 rounded-xl border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/trainer">Start new session</Link>
                </Button>
              </>
            )}
          </article>

          {/* Recent activity */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Recent activity
            </h2>
            <ol className="mt-4 space-y-1">
              {recentActivity.slice(0, 5).map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Clock className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">{a.when}</span>
                    <span className="block text-sm font-medium">{a.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => toast("Coming soon")}
              className="mt-2 text-sm font-medium text-brand hover:underline"
            >
              View all activity →
            </button>
          </div>
        </section>

        {/* Right: milestones & resources */}
        <section aria-labelledby="milestones-heading" className="space-y-5 lg:col-span-3 lg:order-3">
          {/* Quick actions */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Quick actions
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {quickActions.map((qa) => {
                const Icon = qa.icon;
                const locked = "locked" in qa && qa.locked;
                return (
                  <button
                    key={qa.key}
                    type="button"
                    aria-label={qa.label}
                    onClick={() => {
                      if (locked) return;
                      if (qa.key === "support") setSupportOpen(true);
                      else if (qa.key === "report") toast.success("Download ready!");
                      else toast("Coming soon");
                    }}
                    className={
                      locked
                        ? "relative flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 p-3 text-center opacity-70"
                        : "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card"
                    }
                  >
                    {locked && (
                      <span className="absolute inset-0 grid place-items-center rounded-xl bg-background/70">
                        <span className="flex flex-col items-center gap-1">
                          <Lock className="size-4 text-locked" aria-hidden="true" />
                          <Badge variant="secondary" className="text-[10px]">
                            {qa.unlocks}
                          </Badge>
                        </span>
                      </span>
                    )}
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                    <span className="text-xs font-medium leading-tight">{qa.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={milestonesRef} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 id="milestones-heading" className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Milestones
            </h2>
            <ol className="mt-5 space-y-4">
              {milestones.map((m) => (
                <li key={m.day} className="flex gap-3">
                  <span
                    className={
                      m.state === "done"
                        ? "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success/15 text-success"
                        : m.state === "active"
                          ? "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-warning/20 text-warning"
                          : "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-muted text-locked"
                    }
                    aria-hidden="true"
                  >
                    {m.state === "done" ? (
                      <Check className="size-3.5" />
                    ) : m.state === "active" ? (
                      <Clock className="size-3.5" />
                    ) : (
                      <Lock className="size-3" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-muted-foreground">{m.day}</span>
                    <span
                      className={
                        m.state === "locked"
                          ? "block text-sm text-muted-foreground"
                          : "block text-sm font-medium"
                      }
                    >
                      {m.label}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Resources
            </h2>
            <ul className="mt-4 space-y-1">
              {resources.map(({ icon: Icon, label, meta }) => (
                <li key={label}>
                  <a
                    href="#"
                    className="flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent"
                  >
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{label}</span>
                      <span className="block text-xs text-muted-foreground">{meta}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Mobile sticky practice CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <Button asChild className="min-h-12 w-full rounded-xl text-base">
          <Link to="/trainer">
            <Mic />
            Practise now
          </Link>
        </Button>
      </div>

      {/* Badge detail dialog */}
      <Dialog open={Boolean(selectedBadge)} onOpenChange={(open) => !open && setSelectedBadge(null)}>
        <DialogContent className="rounded-2xl">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">{selectedBadge.emoji}</span>
                  {selectedBadge.title}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{selectedBadge.how}</p>
              <p className="text-sm">
                {selectedBadge.earned ? (
                  <span className="font-medium text-success">Earned {selectedBadge.earned}</span>
                ) : (
                  <span className="font-medium text-locked">Not yet unlocked</span>
                )}
              </p>
              <Button
                className="mt-2 min-h-11 rounded-xl"
                onClick={() => toast("Shared to your activity feed!")}
              >
                <Share2 className="size-4" />
                Share
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Support chat */}
      <Sheet open={supportOpen} onOpenChange={setSupportOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Get support</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-2 overflow-y-auto py-2">
            {chatLog.map((m, i) => (
              <p key={i} className="rounded-xl bg-accent px-3 py-2 text-sm text-accent-foreground">
                {m}
              </p>
            ))}
          </div>
          <div className="flex gap-2 border-t border-border pt-3">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Type a message…"
              aria-label="Message support"
              className="min-h-11"
            />
            <Button className="min-h-11" onClick={sendChat}>
              Send
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {tourEnabled && <OnboardingTour steps={tourSteps} onFinish={dismiss} />}
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative grid size-36 place-items-center"
      role="img"
      aria-label={`${value} percent of training complete`}
    >
      <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <span className="absolute text-3xl font-bold">{value}%</span>
    </div>
  );
}
