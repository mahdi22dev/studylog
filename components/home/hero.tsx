import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center py-12 md:py-20 mb-36">
      {/* Free badge */}
      <div className="inline-flex items-center gap-2 bg-[#1d1f27] py-2 px-5 rounded-full mb-10 border border-white/5 shadow-md">
        <Sparkles className="h-4 w-4 text-[#38dfab]" />
        <span className="text-sm font-semibold tracking-wider text-[#c9c3d9]">
          Free to start — no card needed
        </span>
      </div>

      {/* Animated Timer Ring (Larger) */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 mb-10 flex items-center justify-center animate-float">
        <div className="absolute inset-0 rounded-full border-2 border-[#6c47ff]/60 animate-pulse-ring-1" />
        <div className="absolute -inset-3 rounded-full border border-[#6c47ff]/30 animate-pulse-ring-2" />
        <div className="absolute -inset-6 rounded-full border border-[#6c47ff]/15 animate-pulse-ring-3" />
        <div className="absolute inset-5 rounded-full bg-[#111827]/60 backdrop-blur-sm" />
        <div className="relative z-10 font-heading text-[90px] md:text-[104px] leading-[104px] font-extrabold tracking-[-0.04em] text-[#c9beff] drop-shadow-2xl">
          25:00
        </div>
      </div>

      {/* Headline (Larger) */}
      <h1 className="font-heading text-[36px] md:text-[52px] font-extrabold leading-[1.15] tracking-[-0.02em] mb-6 max-w-3xl mx-auto">
        Study smarter.
        <br />
        <span className="text-gradient">Track what matters.</span>
      </h1>

      {/* Subtitle (Larger) */}
      <p className="text-lg md:text-xl leading-relaxed text-[#c9c3d9] max-w-2xl mx-auto mb-12 font-normal">
        Transform your learning journey with focused study sessions,
        intelligent progress tracking, and personalized productivity insights.
      </p>

      {/* CTA Button */}
      <div className="flex flex-wrap justify-center gap-4 mb-20">
        <Link
          href="/timer"
          className="bg-[#6c47ff] text-white px-9 py-4 rounded-full text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#6c47ff]/25 flex items-center gap-3 group"
        >
          Start Studying Now
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="flex justify-center gap-12 md:gap-28 opacity-90">
        <div className="text-center">
          <div className="font-heading text-3xl md:text-4xl font-bold tracking-[-0.02em] text-[#c9beff] mb-1">
            25min
          </div>
          <div className="text-xs font-semibold tracking-widest text-[#c9c3d9] uppercase">
            Focus Sessions
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading text-3xl md:text-4xl font-bold tracking-[-0.02em] text-[#38dfab] mb-1">
            5min
          </div>
          <div className="text-xs font-semibold tracking-widest text-[#c9c3d9] uppercase">
            Break Time
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading text-3xl md:text-4xl font-bold tracking-[-0.02em] text-[#c9beff] mb-1">
            ∞
          </div>
          <div className="text-xs font-semibold tracking-widest text-[#c9c3d9] uppercase">
            Customizable
          </div>
        </div>
      </div>
    </section>
  );
}
