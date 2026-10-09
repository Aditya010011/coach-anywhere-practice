import { Bell, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UwLogo } from "@/components/uw/SiteHeader";
import { getSession, getDisplayName, getInitials, logout } from "@/lib/auth";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/training", label: "Training" },
  { to: "/trainer", label: "Practice" },
  { to: "/sessions", label: "Sessions" },
  { to: "/badges", label: "Badges" },
] as const;

/**
 * Shared header for signed-in pages (dashboard, training, sessions, badges,
 * settings). Provides primary navigation plus an account menu with
 * settings/log-out, so users can move between pages without relying on the
 * marketing `SiteHeader` (which only links to anchors on the landing page).
 */
export function AppHeader() {
  const navigate = useNavigate();
  const session = getSession();
  const displayName = getDisplayName(session);
  const firstName = displayName.split(" ")[0];
  const initials = getInitials(displayName);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
        <Link to="/dashboard" aria-label="Dashboard home" className="min-w-0">
          <UwLogo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground hover:text-foreground [&.active]:font-semibold [&.active]:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications" className="min-h-11 min-w-11">
            <Bell />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="min-h-11 gap-2 px-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">{firstName}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>Dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
