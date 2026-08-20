"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const freeFeatures = [
  "Pomodoro timer",
  "Session notes",
  "Daily progress view",
  "Basic goal setting",
  "Up to 7-day history",
];

const proFeatures = [
  "Everything in Free",
  "Streak analytics + heatmap",
  "Unlimited session history",
  "Export reports (PDF / CSV)",
  "Weekly summary emails",
];

export function UpgradeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [cycle, setCycle] = useState<"annual" | "monthly">("annual");
  const [loading, setLoading] = useState(false);

  const price = cycle === "annual" ? "$40" : "$5";
  const priceLabel = cycle === "annual" ? "/year" : "/month";

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycle }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      toast.error(data.error || "Couldn't start checkout. Please try again.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111827] border border-white/10 text-white rounded-2xl p-6 sm:max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sora text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#6c47ff]" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-xs text-white/40">
            Unlock the full picture of your studying
          </DialogDescription>
        </DialogHeader>

        {/* Billing cycle toggle */}
        <div className="flex justify-center pt-1">
          <div className="glass-card p-1 rounded-full flex items-center relative w-fit border border-white/10">
            <button
              onClick={() => setCycle("annual")}
              className={cn(
                "relative z-10 text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300",
                cycle === "annual"
                  ? "bg-[#6c47ff] text-white shadow-md"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              Annual{" "}
              <span className="ml-1 text-[10px] text-[#38dfab] uppercase tracking-wider font-bold">
                Save 33%
              </span>
            </button>
            <button
              onClick={() => setCycle("monthly")}
              className={cn(
                "relative z-10 text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300",
                cycle === "monthly"
                  ? "bg-[#6c47ff] text-white shadow-md"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Free vs Pro comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="bg-[#0D121F] border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
              Free
            </h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading text-3xl font-bold text-white">
                $0
              </span>
              <span className="text-xs text-white/40">/forever</span>
            </div>
            <ul className="space-y-2.5 mt-4">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-white/30 shrink-0" />
                  <span className="text-xs text-white/60">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1d1f27] border border-[#6c47ff]/50 rounded-2xl p-5 relative shadow-[0_0_24px_rgba(108,71,255,0.15)]">
            <span className="absolute -top-2.5 left-4 bg-[#c9beff] text-[#2f009b] text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full shadow-md">
              Most Popular
            </span>
            <h3 className="text-xs font-bold text-[#c9beff] uppercase tracking-widest mb-4">
              Pro
            </h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-heading text-3xl font-bold text-white">
                {price}
              </span>
              <span className="text-xs text-white/40">{priceLabel}</span>
            </div>
            <ul className="space-y-2.5 mt-4">
              {proFeatures.map((f, i) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#38dfab] shrink-0" />
                  <span
                    className={cn(
                      "text-xs",
                      i === 0 ? "font-semibold text-white" : "text-white/80"
                    )}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#5e35f1] disabled:opacity-60 text-white py-3 rounded-full text-sm font-semibold shadow-lg shadow-[#6c47ff]/25 transition-all"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Upgrade to Pro — {price}
          {cycle === "annual" ? "/year" : "/month"}
        </button>

        <p className="text-center text-[11px] text-white/40">
          Cancel anytime. 7-day refund guarantee. No credit card needed for
          Free.
        </p>
      </DialogContent>
    </Dialog>
  );
}