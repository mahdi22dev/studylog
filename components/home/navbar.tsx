"use client";

import Link from "next/link";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { UserButtonModel } from "@/components/user-button";
import { Navigation } from "@/components/navigation";

export function Navbar() {
  const { isSignedIn } = useAuth();
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A0D14]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="flex justify-between items-center px-6 py-4 max-w-[1200px] mx-auto">
        {/* Brand */}
        <Logo />
        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Navigation />
        </div>
        {/* Right side */}

        <div className="flex items-center gap-3">
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
              className="bg-[#6c47ff] text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide hover:opacity-85 transition-all duration-300 ease-in-out"
            >
              Get Started
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
