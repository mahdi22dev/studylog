"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <section id="faq" className="max-w-[1200px] mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto bg-[rgba(108,71,255,0.03)] border border-[#6c47ff]/20 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6c47ff]/10 border border-[#6c47ff]/20 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-[#c9beff]" />
            <span className="text-xs font-bold text-[#c9beff] uppercase tracking-widest">
              FAQ
            </span>
          </div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
            Frequently Asked Questions
          </h3>
        </div>
        <div className="flex flex-col gap-3.5 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#1d1f27]/90 border border-white/10 rounded-xl p-5 cursor-pointer hover:border-[#6c47ff]/40 transition-all"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-base font-semibold text-white">{faq.q}</h4>
                <ChevronDown
                  className={`h-5 w-5 text-[#c9c3d9] transition-transform duration-300 ${
                    openFaq === i ? "rotate-180 text-[#c9beff]" : ""
                  }`}
                />
              </div>
              {openFaq === i && (
                <p className="text-sm text-[#c9c3d9] mt-3 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
