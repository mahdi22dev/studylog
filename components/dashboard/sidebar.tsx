"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Timer,
  BarChart3,
  FileText,
  Calendar,
  Settings,
  Play,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/timer", label: "Timer", icon: Timer },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/schedule", label: "Calendar", icon: Calendar },
];

function NavContent({
  userSlug,
  onNavigate,
}: {
  userSlug: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const isSettingsActive =
    typeof window !== "undefined" &&
    pathname === "/dashboard/timer" &&
    window.location.search.includes("settings=true");

  return (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 glow-primary">
          <div className="w-4 h-4 rounded-full bg-primary-foreground/20 border-2 border-primary-foreground flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground leading-tight font-sora">
            Focurio
          </h1>
          <p className="text-xs text-muted-foreground font-medium">Deep Work</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard" ||
                (pathname.startsWith("/dashboard/") &&
                  !pathname.startsWith("/dashboard/timer"))
              : pathname === href && !isSettingsActive;

          return (
            <Link
              key={label}
              href={
                href === "/dashboard"
                  ? `/dashboard/${encodeURIComponent(userSlug)}`
                  : href
              }
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}
              />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Bottom section: Settings & CTA */}
      <div className="mt-auto space-y-3 pt-4 border-t border-border">
        <Link
          href="/dashboard/timer?settings=true"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
            isSettingsActive
              ? "bg-primary text-primary-foreground glow-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Settings
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isSettingsActive ? "text-primary-foreground" : "text-muted-foreground"
            )}
          />
          Settings
        </Link>

        <Link
          href="/dashboard/timer?autostart=true"
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full text-sm font-semibold glow-primary transition-all"
        >
          <Play className="h-4 w-4 fill-current" />
          Start Session
        </Link>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userSlug =
    user?.username ||
    user?.firstName?.toLowerCase().replace(/\s+/g, "") ||
    "me";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-border bg-background z-50">
        <NavContent userSlug={userSlug} />
      </aside>

      {/* Mobile hamburger + sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-3 left-4 z-50 md:hidden h-8 w-8 bg-background border border-border text-foreground hover:bg-accent hover:text-foreground rounded-lg shadow-md"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-background border-r border-border [&>button]:hidden"
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <NavContent userSlug={userSlug} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
