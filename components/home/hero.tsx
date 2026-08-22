"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center pt-2 pb-2 mb-2">
      {/* Free badge */}
      <div className="inline-flex items-center gap-2 bg-muted py-2 px-5 rounded-full mb-8 border border-border/50 shadow-md">
        <Sparkles className="h-4 w-4 text-success" />
        <span className="text-sm font-semibold tracking-wider text-muted-foreground">
          Free to start — no card needed
        </span>
      </div>

      {/* Animated Timer Ring */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 mb-8 flex items-center justify-center animate-float">
        <div className="absolute inset-0 rounded-full border-2 border-primary/60 animate-pulse-ring-1" />
        <div className="absolute -inset-3 rounded-full border border-primary/30 animate-pulse-ring-2" />
        <div className="absolute -inset-6 rounded-full border border-primary/15 animate-pulse-ring-3" />
        <div className="absolute inset-5 rounded-full bg-popover/60 backdrop-blur-sm" />
        <div className="relative z-10 font-heading text-[80px] md:text-[92px] leading-[92px] font-extrabold tracking-[-0.04em] text-secondary drop-shadow-2xl">
          25:00
        </div>
      </div>

      {/* Headline */}
      <h1 className="font-heading text-[32px] md:text-[48px] font-extrabold leading-[1.15] tracking-[-0.02em] mb-5 max-w-3xl mx-auto">
        Study smarter.
        <br />
        <span className="text-gradient">Track what matters.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-10 font-normal">
        Transform your learning journey with focused study sessions,
        intelligent progress tracking, and personalized productivity insights.
      </p>

      {/* Two-Button CTA Layout */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <Link
          href="/dashboard/me"
          className="bg-primary text-white px-8 py-3.5 rounded-full text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25 flex items-center gap-2.5 group"
        >
          Start Studying Now
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a
          href="#how-it-works"
          onClick={scrollToHowItWorks}
          className="glass-card text-foreground border border-border hover:border-border hover:bg-white/5 px-8 py-3.5 rounded-full text-base font-semibold tracking-wide transition-all duration-300 flex items-center gap-2"
        >
          See how it works
          <span className="text-secondary">↓</span>
        </a>
      </div>

      {/* Quick Stats */}
      <div className="flex justify-center gap-12 md:gap-24 opacity-90">
        <div className="text-center">
          <div className="font-heading text-2xl md:text-3xl font-bold tracking-[-0.02em] text-secondary mb-1">
            25min
          </div>
          <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Focus Sessions
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading text-2xl md:text-3xl font-bold tracking-[-0.02em] text-success mb-1">
            5min
          </div>
          <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Break Time
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading text-2xl md:text-3xl font-bold tracking-[-0.02em] text-secondary mb-1">
            ∞
          </div>
          <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Customizable
          </div>
        </div>
      </div>
    </section>
  );
}
