"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(
    "annual"
  );

  const freeFeatures = [
    "Pomodoro timer (unlimited sessions)",
    "Session notes",
    "Daily progress view",
    "Basic goal setting",
    "Up to 7-day history",
  ];

  const proFeatures = [
    { text: "Everything in Free", bold: true },
    { text: "Weekly summary emails", bold: false },
    { text: "Smart study reminders", bold: false },
    { text: "Streak analytics + heatmap", bold: false },
    { text: "Unlimited session history", bold: false },
    { text: "Export reports (PDF / CSV)", bold: false },
    { text: "Priority support", bold: false },
  ];

  return (
    <section id="pricing" className="max-w-[1200px] mx-auto px-6 py-16">
      {/* Pricing Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272a32] border border-white/5 mb-4 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#c9beff]" />
          <span className="text-xs font-bold text-[#c9beff] uppercase tracking-widest">
            Pricing
          </span>
        </div>
        <h2 className="font-heading text-[28px] md:text-[44px] md:leading-[52px] font-bold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-[#c9beff] to-[#e6deff] bg-clip-text text-transparent">
            Simple pricing for serious learners.
          </span>
        </h2>
        <p className="text-base md:text-lg text-[#c9c3d9]">
          Intelligent immersion tools to build your daily study habit,
          without the distraction of complex pricing.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-16">
        <div className="glass-card p-1 rounded-full flex items-center relative w-fit border border-white/10">
          <button
            onClick={() => setBillingCycle("annual")}
            className={`relative z-10 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 ${
              billingCycle === "annual"
                ? "bg-[#6c47ff] text-white shadow-md"
                : "text-[#c9c3d9] hover:text-[#e1e2ec]"
            }`}
          >
            Annual{" "}
            <span className="ml-1 text-[10px] text-[#38dfab] uppercase tracking-wider font-bold">
              Save 33%
            </span>
          </button>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`relative z-10 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-[#6c47ff] text-white shadow-md"
                : "text-[#c9c3d9] hover:text-[#e1e2ec]"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto mb-16">
        {/* Free Card */}
        <div className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col h-full hover:border-white/20 transition-all">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-[#c9c3d9] uppercase tracking-widest mb-2">
              Free
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-[48px] leading-[1] font-bold text-[#e1e2ec]">
                $0
              </span>
              <span className="text-sm text-[#c9c3d9]">/forever</span>
            </div>
          </div>
          <p className="text-sm text-[#c9c3d9] mb-6 h-10 leading-relaxed">
            Everything you need to build a daily study habit.
          </p>
          <Link
            href="/sign-up"
            className="w-full text-center text-sm font-semibold text-[#c9beff] border border-[#c9beff]/30 py-3 rounded-full hover:bg-[#c9beff]/10 transition-colors mb-8"
          >
            Get started free
          </Link>
          <ul className="flex flex-col gap-3.5 flex-grow">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check className="h-[18px] w-[18px] text-[#c9beff] shrink-0" />
                <span className="text-sm text-[#e1e2ec]">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Card */}
        <div className="bg-[#1d1f27] rounded-2xl p-8 flex flex-col h-full border border-[#6c47ff]/60 glow-active relative shadow-2xl shadow-[#6c47ff]/10">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-[#c9beff] text-[#2f009b] text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full shadow-md">
              Most Popular
            </span>
          </div>
          <div className="mb-4 mt-2">
            <h3 className="text-xs font-bold text-[#c9beff] uppercase tracking-widest mb-2">
              Pro
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-[48px] leading-[1] font-bold text-[#e1e2ec]">
                {billingCycle === "annual" ? "$40" : "$5"}
              </span>
              <span className="text-sm text-[#c9c3d9]">
                {billingCycle === "annual" ? "/year" : "/month"}
              </span>
            </div>
            <p
              className={`text-xs font-medium text-[#38dfab] mt-1 h-5 transition-opacity ${
                billingCycle === "annual" ? "opacity-100" : "opacity-0"
              }`}
            >
              That&apos;s just $3.33/month
            </p>
          </div>
          <p className="text-sm text-[#c9c3d9] mb-6 h-10 leading-relaxed">
            For serious learners who want the full picture.
          </p>
          <Link
            href="/sign-up"
            className="w-full text-center text-sm font-semibold bg-[#6c47ff] text-white py-3 rounded-full hover:bg-[#5e35f1] transition-all shadow-md mb-8"
          >
            {billingCycle === "annual"
              ? "Start Pro — $40/year"
              : "Start Pro — $5/month"}
          </Link>
          <ul className="flex flex-col gap-3.5 flex-grow">
            {proFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check className="h-[18px] w-[18px] text-[#38dfab] shrink-0" />
                <span
                  className={`text-sm text-[#e1e2ec] ${
                    f.bold ? "font-semibold" : ""
                  }`}
                >
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center text-sm text-[#c9c3d9] mb-12 max-w-2xl mx-auto">
        No credit card needed for Free. Cancel Pro anytime. 7-day refund
        guarantee.
      </p>

      {/* Full-Width Centered CTA Strip */}
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-10 text-center relative overflow-hidden glow-active border border-[#6c47ff]/30 bg-gradient-to-r from-[#6c47ff]/10 via-[#1d1f27] to-[#38dfab]/10">
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-3 text-white">
              Ready to study with intention?
            </h2>
            <p className="text-base text-[#c9c3d9] mb-8">
              Join thousands of high-performance minds building better study habits today.
            </p>
            <Link
              href="/sign-up"
              className="bg-[#6c47ff] text-white px-9 py-3.5 rounded-full text-base font-semibold tracking-wide hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#6c47ff]/25"
            >
              Get Started Now — It&apos;s Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
