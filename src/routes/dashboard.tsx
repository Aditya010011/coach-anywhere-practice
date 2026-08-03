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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UwLogo } from "@/components/uw/SiteHeader";

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

function Dashboard() {
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
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
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

            <Button asChild className="mt-6 min-h-12 w-full rounded-xl text-base">
              <Link to="/trainer">Continue training</Link>
            </Button>
          </div>
        </section>

        {/* Middle: what's next */}
        <section aria-labelledby="next-heading" className="space-y-5 lg:col-span-5 lg:order-2">
          <h2 id="next-heading" className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            What's next
          </h2>

          <article className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
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

          <article className="relative overflow-hidden rounded-2xl bg-gradient-night p-6 shadow-card">
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
          </article>
        </section>

        {/* Right: milestones & resources */}
        <section aria-labelledby="milestones-heading" className="space-y-5 lg:col-span-3 lg:order-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
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
