"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Moon, Sun, Search, Settings, Timer, RotateCcw, Crown } from "lucide-react";
import { useSettingsDialog } from "@/contexts/settingsDialogContext";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/timer", label: "Timer" },
  { href: "/notes", label: "Notes" },
  { href: "/analytics", label: "Analytics" },
  { href: "/schedule", label: "Calendar" },
];

export function DashboardTopbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const { setIsOpen } = useSettingsDialog();
  const [isDelete, setIsDelete] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  const isPremium = role === "premium" || role === "admin";

  const userSlug =
    user?.username ||
    user?.firstName?.toLowerCase().replace(/\s+/g, "") ||
    "me";

  return (
    <header className="fixed top-0 inset-x-0 h-16 bg-background/80 backdrop-blur-xl flex items-center justify-between px-8 z-40 border-b border-border">
      {/* Left: Logo + Name */}
      <Link
        href={`/dashboard/${encodeURIComponent(userSlug)}`}
        className="flex items-center gap-2.5 shrink-0"
      >
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow-primary">
          <div className="w-3.5 h-3.5 rounded-full bg-primary-foreground/20 border-2 border-primary-foreground flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
          </div>
        </div>
        <span className="text-lg font-bold text-foreground font-sora tracking-tight">
          Focurio
        </span>
      </Link>

      {/* Center: Nav links */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map(({ href, label }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard" ||
                (pathname.startsWith("/dashboard/") &&
                  !pathname.startsWith("/dashboard/timer"))
              : href === "/dashboard/timer"
                ? pathname === "/dashboard/timer"
                : pathname === href;

          return (
            <Link
              key={label}
              href={
                href === "/dashboard"
                  ? `/dashboard/${encodeURIComponent(userSlug)}`
                  : href
              }
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-white border border-border rounded-full py-1.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full bg-white border border-border hover:bg-accent"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full bg-white border border-border hover:bg-accent"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button
          className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full bg-white border border-border hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User Avatar with Pro Badge */}
        <div className="relative">
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Pomodoro settings"
                labelIcon={<Timer className="w-[17px] h-[17px]" />}
                onClick={() => setIsOpen(true)}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Reset data"
                labelIcon={
                  <RotateCcw className="w-[17px] h-[17px] text-destructive" />
                }
                onClick={() => setIsDelete(true)}
              />
            </UserButton.MenuItems>
          </UserButton>
          {isPremium && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center shadow-md z-50">
              <Crown className="w-2.5 h-2.5 text-white" />
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
