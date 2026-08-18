"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Moon, Search, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";

export function DashboardTopbar() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 h-16 bg-[#0A0D14]/80 backdrop-blur-xl flex items-center justify-between px-6 z-40">
      {/* Search Input Bar */}
      <div className="relative w-64 hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[#0D121F] border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#6c47ff] transition-colors"
        />
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-4 ml-auto">
        <button
          className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/[0.05]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/[0.05]"
          aria-label="Toggle theme"
        >
          <Moon className="h-4 w-4" />
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full ring-offset-[#0A0D14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c47ff] focus-visible:ring-offset-2 transition-all">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.fullName || "User"}
                />
                <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] text-xs font-bold">
                  {user?.firstName?.[0] || user?.username?.[0] || "F"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-[#111827] border border-white/10 text-white/80"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-white">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-xs text-white/40 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="text-white/60 hover:text-white focus:text-white focus:bg-white/[0.06] cursor-pointer gap-2">
              <User className="h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <SignOutButton>
              <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 cursor-pointer gap-2">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
