import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Pause, Volume2, Maximize, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function VideoDemoDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="max-w-[800px] gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-lift">
<DialogTitle className="sr-only">How UW Partner Coach works</DialogTitle>
        <DialogClose
          aria-label="Close video"
          className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-primary-foreground/15 text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogClose>

        <div className="relative aspect-video w-full overflow-hidden bg-gradient-night">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in oklab, var(--primary-foreground) 25%, transparent) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause preview" : "Play preview"}
            className="absolute inset-0 grid place-items-center"
          >
            <span className="grid size-20 place-items-center rounded-full bg-primary-foreground/15 text-primary-foreground shadow-lift backdrop-blur transition-transform hover:scale-105">
              {playing ? (
                <Pause className="size-9" aria-hidden="true" />
              ) : (
                <Play className="size-9 translate-x-0.5" aria-hidden="true" />
              )}
            </span>
          </button>

          <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-primary-foreground">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="grid size-8 min-h-8 min-w-8 place-items-center rounded-full hover:bg-primary-foreground/15"
            >
              {playing ? (
                <Pause className="size-4" aria-hidden="true" />
              ) : (
                <Play className="size-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-label="Volume"
              className="grid size-8 min-h-8 min-w-8 place-items-center rounded-full hover:bg-primary-foreground/15"
            >
              <Volume2 className="size-4" aria-hidden="true" />
            </button>
            <span className="ml-auto font-mono text-xs tabular-nums text-primary-foreground/80">
              {playing ? "0:42" : "0:00"} / 2:30
            </span>
            <button
              type="button"
              aria-label="Fullscreen"
              className="grid size-8 min-h-8 min-w-8 place-items-center rounded-full hover:bg-primary-foreground/15"
            >
              <Maximize className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="bg-card px-6 py-8 text-center sm:px-10">
          <h3 className="text-2xl font-bold tracking-tight">See how easy it is</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Watch Sarah complete her first AI practice session
          </p>
          <Button asChild size="lg" className="mt-6 min-h-12 rounded-xl px-6">
            <Link to="/signup" onClick={() => setOpen(false)}>
              Start your training
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
