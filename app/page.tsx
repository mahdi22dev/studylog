"use client";

import { Navbar } from "@/components/home/navbar";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { Pricing } from "@/components/home/pricing";
import { BlogPreview } from "@/components/home/blog-preview";
import { Faq } from "@/components/home/faq";
import { Footer } from "@/components/home/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#e1e2ec]">
      {/* Navbar */}
      <Navbar />

      {/* Atmospheric background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6c47ff]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#38dfab]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6c47ff]/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow pt-24 pb-24">
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <BlogPreview />
        <Faq />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
