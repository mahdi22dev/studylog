"use client";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { Brain, Sparkles, Mail, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      category: "Deep Work",
      categoryColor: "bg-[#272a32] text-[#c9beff]",
      date: "Oct 12",
      readTime: "5 min read",
      title: "Why 25 minutes is the sweet spot for deep focus",
      excerpt:
        "Exploring the Pomodoro technique's neurological basis and why pushing beyond cognitive limits backfires.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Research",
      categoryColor: "bg-[#38dfab]/20 text-[#38dfab]",
      date: "Oct 08",
      readTime: "6 min read",
      title: "The spacing effect: why studying daily beats cramming",
      excerpt:
        "How to leverage algorithmic repetition to move information from short-term to robust long-term memory.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Student Life",
      categoryColor: "bg-[#cebdff]/20 text-[#cebdff]",
      date: "Oct 01",
      readTime: "4 min read",
      title: "How to build a study habit that actually sticks",
      excerpt:
        "Actionable frameworks to reduce the friction of starting and transform studying into an automatic behavior.",
      image:
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Deep Work",
      categoryColor: "bg-[#272a32] text-[#c9beff]",
      date: "Sep 28",
      readTime: "7 min read",
      title: "Creativity vs. Productivity: Finding the Balance",
      excerpt:
        "Structuring your environment to allow for both intense execution and unstructured ideation phases.",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Student Life",
      categoryColor: "bg-[#cebdff]/20 text-[#cebdff]",
      date: "Sep 22",
      readTime: "5 min read",
      title: "Digital Minimalism for Modern Students",
      excerpt:
        "Reclaiming your attention span in an era of infinite feeds and engineered distraction.",
      image:
        "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#e1e2ec] flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Atmospheric background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6c47ff]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#38dfab]/[0.04] rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow pt-28 pb-24 max-w-[1200px] mx-auto px-6 w-full">
        {/* Page Header */}
        <header className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272a32] border border-white/5 mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#c9beff]" />
            <span className="text-xs font-bold text-[#c9beff] uppercase tracking-widest">
              Focurio Science Journal
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Study Science, Unpacked
          </h1>
          <p className="text-base md:text-lg text-[#c9c3d9] leading-relaxed">
            Insights, strategies, and the neuroscience behind deep work and
            frictionless productivity.
          </p>
        </header>

        {/* Featured Article */}
        <section className="mb-16">
          <div className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row group cursor-pointer hover:border-[#6c47ff]/50 hover:shadow-2xl hover:shadow-[#6c47ff]/10 transition-all duration-300">
            <div className="w-full lg:w-3/5 h-[280px] lg:h-[420px] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&auto=format&fit=crop"
                alt="The Flow State"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
            </div>
            <div className="w-full lg:w-2/5 p-8 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6c47ff]/20 text-[#c9beff] text-xs font-bold uppercase tracking-wider mb-4">
                  <Brain className="h-3.5 w-3.5" />
                  Featured Research
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#c9beff] transition-colors">
                  The Flow State
                </h2>
                <p className="text-[#c9c3d9] text-sm md:text-base leading-relaxed line-clamp-3 mb-6">
                  Discover the precise environmental and psychological triggers
                  required to enter deep, uninterrupted flow. We unpack the
                  latest neurobiological studies that explain why time dilates
                  when you are truly immersed.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-[#c9c3d9] pt-4 border-t border-white/5">
                <span className="font-semibold">By Dr. Sarah Chen</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>8 min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="mb-20">
          <h2 className="font-heading text-xl font-bold text-white mb-8">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <article
                key={i}
                className="bg-[#1d1f27]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1.5 hover:border-[#6c47ff]/50 hover:shadow-2xl hover:shadow-[#6c47ff]/15 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-[#c9c3d9]">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-3 group-hover:text-[#c9beff] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#c9c3d9] leading-relaxed line-clamp-2 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#c9c3d9] mt-auto pt-4 border-t border-white/5">
                    <span>Read Article</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Box */}
        <section className="bg-gradient-to-r from-[#6c47ff]/10 via-[#1d1f27] to-[#38dfab]/10 border border-[#6c47ff]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#6c47ff]/10 border border-[#6c47ff]/20 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-[#c9beff]" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
              Get study tips delivered weekly.
            </h2>
            <p className="text-sm md:text-base text-[#c9c3d9] mb-8">
              Join thousands of high-performance minds receiving our best insights
              on focus, neuroscience, and intelligent immersion.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow bg-[#0D121F] border border-white/10 rounded-full px-6 py-3 text-sm text-white placeholder-[#c9c3d9]/40 focus:outline-none focus:border-[#6c47ff] transition-colors h-12"
              />
              <button
                type="submit"
                className="bg-[#6c47ff] hover:bg-[#5e35f1] text-white font-semibold text-sm px-8 py-3 rounded-full transition-all duration-300 h-12 whitespace-nowrap cursor-pointer shadow-md"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-[#c9c3d9]/70 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
