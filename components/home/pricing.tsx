"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(
    "annual"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const faqs = [
    {
      q: "Is my study data private?",
      a: "Absolutely. Focurio is built with privacy in mind. We do not sell your data, and your study notes are encrypted. You can request to delete your account and all associated data at any time.",
    },
    {
      q: "Do you offer student discounts?",
      a: "Yes! Verified students get 50% off Pro. Contact us with your .edu email to get the discount applied.",
    },
    {
      q: "Can I try Pro before buying?",
      a: "The Free plan gives you full access to core features. Upgrade to Pro anytime to unlock advanced analytics and exports.",
    },
  ];

  return (
    <section id="pricing" className="max-w-[1200px] mx-auto px-6 py-16">
      {/* Pricing Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-heading text-[28px] md:text-[48px] md:leading-[56px] font-bold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-[#c9beff] to-[#e6deff] bg-clip-text text-transparent">
            Simple pricing for serious learners.
          </span>
        </h2>
        <p className="text-lg text-[#c9c3d9]">
          Intelligent immersion tools to build your daily study habit,
          without the distraction of complex pricing.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-16">
        <div className="glass-card p-1 rounded-full flex items-center relative w-fit">
          <button
            onClick={() => setBillingCycle("annual")}
            className={`relative z-10 text-sm font-semibold px-6 py-2 rounded-full transition-all ${
              billingCycle === "annual"
                ? "bg-[#6c47ff] text-white"
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
            className={`relative z-10 text-sm font-semibold px-6 py-2 rounded-full transition-all ${
              billingCycle === "monthly"
                ? "bg-[#6c47ff] text-white"
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
        <div className="glass-card rounded-xl p-6 flex flex-col h-full">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-[#c9c3d9] uppercase tracking-wider mb-2">
              Free
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-[48px] leading-[1] font-bold text-[#e1e2ec]">
                $0
              </span>
              <span className="text-sm text-[#c9c3d9]">/forever</span>
            </div>
          </div>
          <p className="text-sm text-[#c9c3d9] mb-6 h-10">
            Everything you need to build a daily study habit.
          </p>
          <Link
            href="/sign-up"
            className="w-full text-center text-sm font-semibold text-[#c9beff] border border-[#c9beff]/30 py-3 rounded-full hover:bg-[#c9beff]/10 transition-colors mb-6"
          >
            Get started free
          </Link>
          <ul className="flex flex-col gap-3 flex-grow">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check className="h-[18px] w-[18px] text-[#c9beff] shrink-0" />
                <span className="text-sm text-[#e1e2ec]">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Card */}
        <div className="bg-[#1d1f27] rounded-xl p-6 flex flex-col h-full border border-[#c9beff]/30 glow-active relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-[#c9beff] text-[#2f009b] text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full">
              Most Popular
            </span>
          </div>
          <div className="mb-3 mt-2">
            <h3 className="text-sm font-semibold text-[#c9beff] uppercase tracking-wider mb-2">
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
          <p className="text-sm text-[#c9c3d9] mb-6 h-10">
            For serious learners who want the full picture.
          </p>
          <Link
            href="/sign-up"
            className="w-full text-center text-sm font-semibold bg-[#6c47ff] text-white py-3 rounded-full hover:bg-[#5e35f1] transition-colors mb-6"
          >
            {billingCycle === "annual"
              ? "Start Pro — $40/year"
              : "Start Pro — $5/month"}
          </Link>
          <ul className="flex flex-col gap-3 flex-grow">
            {proFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <Check className="h-[18px] w-[18px] text-[#38dfab] shrink-0" />
                <span
                  className={`text-sm text-[#e1e2ec] ${
                    f.bold ? "font-medium" : ""
                  }`}
                >
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center text-sm text-[#c9c3d9] mb-16 max-w-2xl mx-auto">
        No credit card needed for Free. Cancel Pro anytime. 7-day refund
        guarantee.
      </p>

      {/* CTA + FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
        {/* Ready to start CTA */}
        <div className="lg:col-span-5 glass-card rounded-xl p-10 text-center lg:text-left flex flex-col justify-center h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[#6c47ff]/5 z-0" />
          <div className="relative z-10">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] mb-3">
              Ready to start?
            </h2>
            <p className="text-base text-[#c9c3d9] mb-6">
              Join thousands of high-performance minds building better
              habits today.
            </p>
            <Link
              href="/sign-up"
              className="inline-block text-sm font-semibold bg-[#e1e2ec] text-[#10131a] px-8 py-3 rounded-full hover:bg-[#32353d] hover:text-[#e1e2ec] transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h3 className="font-heading text-xl font-semibold tracking-[-0.01em] mb-2">
            Frequently Asked Questions
          </h3>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-card rounded-lg p-4 cursor-pointer hover:bg-[#32353d]/30 transition-colors"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold">{faq.q}</h4>
                <ChevronDown
                  className={`h-4 w-4 text-[#c9c3d9] transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openFaq === i && (
                <p className="text-sm text-[#c9c3d9] mt-2">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
