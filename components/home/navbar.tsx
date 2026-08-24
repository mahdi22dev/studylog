"use client";

import Link from "next/link";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { UserButtonModel } from "@/components/user-button";
import { Navigation } from "@/components/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="flex justify-between items-center px-6 py-4 max-w-[1200px] mx-auto">
        {/* Brand */}
        <Logo />
        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Navigation />
        </div>
        {/* Right side */}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-accent"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <UserButtonModel />
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out text-sm font-semibold tracking-wide hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold tracking-wide hover:opacity-85 transition-all duration-300 ease-in-out"
            >
              Get Started
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
