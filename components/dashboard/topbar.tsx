"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, Moon, Search, Timer, RotateCcw, Sparkles } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { useSettingsDialog } from "@/contexts/settingsDialogContext";
import { UpgradeDialog } from "@/components/billing/upgrade-dialog";
import { useState } from "react";

export function DashboardTopbar() {
  const { user } = useUser();
  const { setIsOpen } = useSettingsDialog();
  const [isDelete, setIsDelete] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const role = (user?.publicMetadata as { role?: string } | null)?.role;
  const isPremium = role === "premium" || role === "admin";

  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 h-16 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 z-40 border-b border-border">
      {/* Search Input Bar */}
      <div className="relative w-64 hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-input border border-border rounded-full py-2 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
        />
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {!isPremium && (
          <button
            onClick={() => setUpgradeOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-secondary bg-gradient-upgrade border border-primary/40 rounded-full px-3 py-1.5 hover:bg-primary/30 hover:border-primary/70 transition-all"
            aria-label="Upgrade to Pro"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Upgrade
          </button>
        )}

        <button
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-accent"
          aria-label="Toggle theme"
        >
          <Moon className="h-4 w-4" />
        </button>

        {/* User Profile Dropdown */}
        <UserButton>
          <UserButton.MenuItems>
            {/* TODO: Implement delete data functionality */}
            <UserButton.Action
              label="Pomodoro settings"
              labelIcon={<Timer className="w-[17px] h-[17px]" />}
              onClick={() => setIsOpen(true)}
            />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            {/* TODO: Implement delete data functionality */}
            <UserButton.Action
              label="Reset data"
              labelIcon={
                <RotateCcw className="w-[17px] h-[17px] text-destructive" />
              }
              onClick={() => setIsDelete(true)}
            />
          </UserButton.MenuItems>
        </UserButton>
      </div>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </header>
  );
}
