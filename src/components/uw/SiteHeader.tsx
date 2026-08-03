import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function UwLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-sm font-bold tracking-tight text-primary-foreground">
        UW
      </span>
      <span
        className={
          inverted
            ? "text-sm font-bold tracking-tight text-primary-foreground"
            : "text-sm font-bold tracking-tight text-foreground"
        }
      >
        Partner Coach
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="UW Partner Coach home">
          <UwLogo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          <a href="#why" className="text-sm text-muted-foreground hover:text-foreground">
            Why voice AI
          </a>
          <a href="#modules" className="text-sm text-muted-foreground hover:text-foreground">
            Modules
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/dashboard">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="min-h-11 rounded-xl px-4">
            <Link to="/dashboard">Start training</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
