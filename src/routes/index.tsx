import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mic,
  Clock,
  TrendingUp,
  Star,
  Play,
  Check,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader, UwLogo } from "@/components/uw/SiteHeader";
import { Waveform } from "@/components/uw/Waveform";
import { VideoDemoDialog } from "@/components/uw/VideoDemoDialog";
import { HeroStats } from "@/components/uw/HeroStats";
import { ModulesExplorer } from "@/components/uw/ModulesExplorer";
import { DialogTrigger } from "@/components/ui/dialog";
import heroPartner from "@/assets/hero-partner.jpg";
import aiOrb from "@/assets/ai-orb.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UW Partner Coach — Voice AI Training for New UW Partners" },
      {
        name: "description",
        content:
          "Practise real customer conversations with a 24/7 voice AI coach. Four foundation modules, instant feedback and progress tracking for UW Partners.",
      },
      { property: "og:title", content: "UW Partner Coach — Your Personal AI Coach for UW Success" },
      {
        property: "og:description",
        content:
          "Voice-first training for new UW Partners. Practise anywhere, build confidence before your first customer conversation.",
      },
    ],
  }),
  component: Landing,
});

const reasons = [
  {
    icon: Mic,
    title: "Practice real conversations",
    body: "Role-play customer objections and questions with an AI that responds like a real prospect. No judgment, unlimited retries.",
  },
  {
    icon: Clock,
    title: "Train on your schedule",
    body: "Five-minute sessions between errands or deep practice at midnight. The AI coach never sleeps.",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    body: "See your confidence grow. The AI adapts to your level and highlights what to work on next.",
  },
];

const steps = [
  {
    n: "01",
    title: "Sign up in 30 seconds",
    body: "Just your name and email to get started.",
  },
  {
    n: "02",
    title: "Complete 4 foundation modules",
    body: "UW basics, commission plan, bill savings, your first customer.",
  },
  {
    n: "03",
    title: "Practise with your AI coach",
    body: "Tap, speak, get instant feedback on every answer.",
  },
  {
    n: "04",
    title: "Go live with confidence",
    body: "Have your first real conversation and unlock advanced training.",
  },
];

const testimonials = [
  {
    quote:
      "I was terrified to talk to people about UW. After practising with the AI for a week I signed my first customer — my neighbour. It helped me handle her 'I'm too busy' objection perfectly.",
    name: "Sarah M.",
    place: "Birmingham · Partner since 2025",
  },
  {
    quote:
      "The voice trainer is genius. I practise in my car during lunch breaks. It's like having a personal coach who never gets tired of my questions.",
    name: "James T.",
    place: "Manchester",
  },
  {
    quote:
      "This is the first training platform that actually teaches you how to talk to people, not just what to say.",
    name: "Priya K.",
    place: "London",
  },
];

const faqs = [
  {
    q: "Is this portal only for new UW Partners?",
    a: "Primarily yes, but existing Partners can refresh their skills any time.",
  },
  {
    q: "Do I need to finish training before speaking to customers?",
    a: "We strongly recommend Modules 1–4 and at least three AI practice sessions first. Confidence makes conversations easier.",
  },
  {
    q: "How much does the training cost?",
    a: "The onboarding portal is completely free for all active UW Partners.",
  },
  {
    q: "Will the AI help me earn more?",
    a: "The AI helps you practise conversations and build confidence. Your results depend on your effort, your market and how you apply the training.",
  },
  {
    q: "What if I don't like talking to an AI?",
    a: "No problem. Every module has written content and video. The AI is optional, but most Partners find it the fastest way to build confidence.",
  },
];

function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-70"
            style={{
              background:
                "radial-gradient(60% 50% at 15% 0%, var(--brand-soft), transparent 70%), radial-gradient(50% 40% at 95% 10%, color-mix(in oklab, var(--gold) 25%, transparent), transparent 70%)",
            }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div className="animate-rise">
              <Badge className="rounded-full border-0 bg-accent px-3 py-1 text-accent-foreground hover:bg-accent">
                Voice-first partner training
              </Badge>
              <h1 className="mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Your personal <span className="text-gradient-brand">AI coach</span> for UW success
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Join thousands of UW Partners building their business with 24/7 voice AI training,
                proven frameworks and expert support.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="min-h-12 rounded-xl px-6 text-base">
                  <Link to="/trainer">
                    Start your training
                    <ArrowRight />
                  </Link>
                </Button>
                <VideoDemoDialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-h-12 rounded-xl border-primary/40 px-6 text-base text-primary hover:bg-accent"
                    >
                      <Play />
                      Watch how it works
                    </Button>
                  </DialogTrigger>
                </VideoDemoDialog>
              </div>
              <ul className="mt-9 grid gap-3 sm:grid-cols-2">
                {[
                  "5,000+ Partners trained",
                  "Available 24/7 on any device",
                  "Practise until you're confident",
                  "Free for active UW Partners",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2">
                <span className="flex" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-4 fill-gold text-gold" />
                  ))}
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.8 / 5</span> from Partner reviews
                </span>
              </div>
              <HeroStats />
            </div>

            {/* Hero visual */}
            <div className="relative animate-rise lg:pl-16" style={{ animationDelay: "120ms" }}>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-night p-6 shadow-lift sm:p-8">
                <div className="flex items-center justify-between text-primary-foreground/70">
                  <span className="text-xs font-medium tracking-wide uppercase">
                    Live practice session
                  </span>
                  <span className="font-mono text-xs">04:12</span>
                </div>
                <Waveform className="my-8 h-32" />
                <div className="space-y-3">
                  <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary-foreground/12 px-4 py-3 text-sm text-primary-foreground">
                    How do I explain the bundle discount?
                  </p>
                  <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-gradient-brand px-4 py-3 text-sm text-primary-foreground shadow-lift">
                    Great question! Let me walk you through it — start with the bills they already
                    pay, then show what changes when they come together.
                  </p>
                </div>
              </div>
              <img
                src={heroPartner}
                alt="A UW Partner smiling while practising a voice session on her phone in a café"
                width={1024}
                height={1280}
                className="absolute bottom-6 left-0 hidden size-32 rounded-3xl border-4 border-background object-cover shadow-lift lg:block"
              />
            </div>
          </div>
        </section>

        {/* Why voice AI */}
        <section id="why" className="border-y border-border bg-secondary/50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Why voice AI training?
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {reasons.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                    <Icon className="size-6" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              From nervous to confident in four steps
            </h2>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <li
                  key={s.n}
                  className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
                >
                  <span className="font-mono text-sm font-medium text-primary">{s.n}</span>
                  <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="border-y border-border bg-secondary/50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              What you'll master
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <Progress value={0} className="h-2" />
              <span className="shrink-0 text-sm text-muted-foreground">0% complete</span>
            </div>
            <ModulesExplorer />
          </div>
        </section>

        {/* Meet your AI coach */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-night p-8 shadow-lift">
              <img
                src={aiOrb}
                alt="Abstract glowing orb representing the voice AI coach"
                loading="lazy"
                width={1024}
                height={1024}
                className="mx-auto size-56 rounded-full object-cover sm:size-72"
              />
              <Waveform className="mt-8 h-16" bars={[24, 44, 62, 36, 70, 40, 26, 52, 32]} />
              <p className="mt-6 text-center font-mono text-xs text-primary-foreground/70">
                listening…
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Always ready to practise
              </h2>
              <ul className="mt-7 space-y-4">
                {[
                  "Responds in natural conversation, not scripted Q&A",
                  "Handles objections like a real customer",
                  "Gives instant feedback on your answers",
                  "Adapts difficulty as you improve",
                  "Available in English, with more languages planned",
                ].map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                    <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-8 min-h-12 rounded-xl px-6">
                <Link to="/trainer">
                  <Mic />
                  Try a free practice session
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y border-border bg-secondary/50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Partners who started exactly where you are
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="flex flex-col rounded-2xl border-l-4 border-l-primary bg-card p-6 shadow-card"
                >
                  <span className="flex" aria-label="Rated 5 out of 5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="size-4 fill-gold text-gold" aria-hidden="true" />
                    ))}
                  </span>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.place}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Common questions</h2>
            <Accordion type="single" collapsible className="mt-8">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`f${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold text-primary hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="mt-8 rounded-2xl bg-secondary p-5 text-xs leading-relaxed text-muted-foreground">
              UW Partners must follow the Partner Guidelines at all times. Nothing in this training
              constitutes an income claim or guarantee of results.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-brand p-10 text-center shadow-lift sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-balance text-primary-foreground sm:text-4xl">
              You've got this. Let's practise your first conversation.
            </h2>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8 min-h-12 rounded-xl px-8 text-base"
            >
              <Link to="/trainer">
                <Mic />
                Start your training
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <UwLogo />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {[
              "About UW",
              "Privacy Policy",
              "Terms of Use",
              "Partner Guidelines",
              "Contact Support",
            ].map((l) => (
              <a key={l} href="#" className="text-muted-foreground hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">Powered by British AI Consulting</p>
        </div>
      </footer>
    </div>
  );
}
