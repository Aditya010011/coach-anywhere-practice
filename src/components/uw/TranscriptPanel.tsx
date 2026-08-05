import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, Mail, Search, Star, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type TranscriptMessage = {
  id: string;
  who: "ai" | "you";
  text: string;
  at: string;
  keyTip?: boolean;
  reaction?: string;
};

function useTypewriter(text: string, enabled: boolean) {
  const [shown, setShown] = useState(enabled ? "" : text);
  useEffect(() => {
    if (!enabled) {
      setShown(text);
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [text, enabled]);
  return shown;
}

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded bg-gold px-0.5 text-gold-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function Bubble({
  m,
  query,
  animate,
}: {
  m: TranscriptMessage;
  query: string;
  animate: boolean;
}) {
  const isYou = m.who === "you";
  const shown = useTypewriter(m.text, animate && !isYou);

  return (
    <div className={cn("group relative", isYou ? "ml-auto max-w-[85%]" : "max-w-[88%]")}>
      {m.reaction && (
        <span className="animate-rise absolute -top-5 left-3 text-lg" aria-hidden="true">
          {m.reaction}
        </span>
      )}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm",
          isYou
            ? "rounded-br-sm bg-primary-foreground/12"
            : "rounded-bl-sm bg-gradient-brand shadow-lift",
          m.keyTip && "border-2 border-gold",
        )}
      >
        {m.keyTip && (
          <Badge className="mb-2 gap-1 rounded-full bg-gold text-gold-foreground">
            <Star className="size-3 fill-current" aria-hidden="true" />
            Key tip
          </Badge>
        )}
        <p>
          <Highlighted text={shown} query={query} />
        </p>
        <div className="mt-1 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="text-[10px] uppercase tracking-wide opacity-70">{m.at}</span>
          <button
            type="button"
            aria-label="Copy message"
            className="rounded p-1 hover:bg-primary-foreground/15"
            onClick={() => {
              void navigator.clipboard.writeText(m.text);
              toast.success("Message copied");
            }}
          >
            <Copy className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TranscriptPanel({
  messages,
  typing,
  searchRef,
  className,
}: {
  messages: TranscriptMessage[];
  typing?: boolean;
  searchRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const endRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  const matches = useMemo(
    () =>
      query.trim()
        ? messages.filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
        : [],
    [messages, query],
  );

  useEffect(() => setIndex(0), [query]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    firstRender.current = false;
  }, [messages.length, typing]);

  function exportTxt() {
    const body = messages.map((m) => `[${m.at}] ${m.who === "you" ? "You" : "AI Coach"}: ${m.text}`).join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "uw-practice-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript downloaded");
  }

  return (
    <section className={cn("flex min-h-0 flex-col", className)} aria-label="Live transcript">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 opacity-60"
            aria-hidden="true"
          />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find in conversation…"
            aria-label="Find in conversation"
            className="min-h-11 border-primary-foreground/25 bg-primary-foreground/10 pl-9 pr-24 text-primary-foreground placeholder:text-primary-foreground/60"
          />
          {query && (
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <span className="text-xs text-primary-foreground/75">
                {matches.length ? `${Math.min(index + 1, matches.length)} of ${matches.length}` : "0 results"}
              </span>
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="rounded p-1 hover:bg-primary-foreground/15"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="min-h-11 shrink-0 text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Download className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportTxt}>
              <Download className="size-4" /> Download as .txt
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void navigator.clipboard.writeText(
                  messages.map((m) => `${m.who === "you" ? "You" : "AI Coach"}: ${m.text}`).join("\n"),
                );
                toast.success("Transcript copied");
              }}
            >
              <Copy className="size-4" /> Copy to clipboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Email to mentor — coming soon")}>
              <Mail className="size-4" /> Email to mentor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1" aria-live="polite">
        {messages.map((m, i) => (
          <Bubble key={m.id} m={m} query={query} animate={i === messages.length - 1} />
        ))}
        {typing && (
          <div className="w-fit rounded-2xl rounded-bl-sm bg-gradient-brand px-4 py-3 text-sm shadow-lift">
            <span className="animate-pulse tracking-[0.2em]" aria-label="AI coach is responding">
              ●●●
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </section>
  );
}
