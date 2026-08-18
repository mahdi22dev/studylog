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
  { href: "/notes", label: "Analytics", icon: BarChart3 },
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
        <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(108,71,255,0.4)]">
          <div className="w-4 h-4 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight font-sora">
            Focurio
          </h1>
          <p className="text-xs text-white/40 font-medium">Deep Work</p>
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
                  ? "bg-[#6c47ff] text-white shadow-[0_0_20px_rgba(108,71,255,0.35)]"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-white/40"
                )}
              />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Bottom section: Settings & CTA */}
      <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
        <Link
          href="/dashboard/timer?settings=true"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
            isSettingsActive
              ? "bg-[#6c47ff] text-white shadow-[0_0_20px_rgba(108,71,255,0.35)]"
              : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
          )}
        >
          <Settings
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isSettingsActive ? "text-white" : "text-white/40"
            )}
          />
          Settings
        </Link>

        <Link
          href="/dashboard/timer?autostart=true"
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#5e35f1] text-white py-3 rounded-full text-sm font-semibold shadow-[0_0_20px_rgba(108,71,255,0.3)] transition-all"
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
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-white/5 bg-[#0b0e15] z-50">
        <NavContent userSlug={userSlug} />
      </aside>

      {/* Mobile hamburger + sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-3 left-4 z-50 md:hidden h-8 w-8 bg-[#0b0e15] border border-white/10 text-white hover:bg-white/[0.1] hover:text-white rounded-lg shadow-md"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-[#0b0e15] border-r border-white/5 [&>button]:hidden"
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
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
